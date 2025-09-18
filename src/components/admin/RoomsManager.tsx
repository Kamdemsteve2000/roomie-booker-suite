import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Room {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  capacity: number;
  size: string;
  available: boolean;
  features: string[];
  amenities: string[];
  image_url?: string;
  inventory_count: number;
}

export default function RoomsManager() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'standard',
    price: 0,
    capacity: 1,
    size: '',
    available: true,
    features: '',
    amenities: '',
    image_url: '',
    inventory_count: 1
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setRooms(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching rooms",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'standard',
      price: 0,
      capacity: 1,
      size: '',
      available: true,
      features: '',
      amenities: '',
      image_url: '',
      inventory_count: 1
    });
    setEditingRoom(null);
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      description: room.description,
      type: room.type,
      price: room.price,
      capacity: room.capacity,
      size: room.size,
      available: room.available,
      features: room.features.join(', '),
      amenities: room.amenities.join(', '),
      image_url: room.image_url || '',
      inventory_count: room.inventory_count
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const roomData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        price: formData.price,
        capacity: formData.capacity,
        size: formData.size,
        available: formData.available,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
        image_url: formData.image_url || null,
        inventory_count: formData.inventory_count
      };

      if (editingRoom) {
        const { error } = await (supabase as any)
          .from('rooms')
          .update(roomData)
          .eq('id', editingRoom.id);
        
        if (error) throw error;
        
        toast({
          title: "Room updated",
          description: "Room has been updated successfully.",
        });
      } else {
        const { error } = await (supabase as any)
          .from('rooms')
          .insert(roomData);
        
        if (error) throw error;
        
        toast({
          title: "Room created",
          description: "New room has been created successfully.",
        });
      }

      fetchRooms();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving room",
        description: error.message,
      });
    }
  };

  const handleDelete = async (roomId: string, roomName: string) => {
    if (!confirm(`Are you sure you want to delete "${roomName}"?`)) return;
    
    try {
      const { error } = await (supabase as any)
        .from('rooms')
        .delete()
        .eq('id', roomId);
      
      if (error) throw error;
      
      toast({
        title: "Room deleted",
        description: "Room has been deleted successfully.",
      });
      
      fetchRooms();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting room",
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Room Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-gradient-hero">
                <Plus className="h-4 w-4 mr-2" />
                Add Room
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingRoom ? 'Edit Room' : 'Add New Room'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Room Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Room Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="deluxe">Deluxe</SelectItem>
                        <SelectItem value="suite">Suite</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price per Night ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacity (persons)</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="inventory">Available Units</Label>
                    <Input
                      id="inventory"
                      type="number"
                      value={formData.inventory_count}
                      onChange={(e) => setFormData({...formData, inventory_count: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="size">Room Size</Label>
                  <Input
                    id="size"
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    placeholder="e.g., 35 m²"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="features">Features (comma-separated)</Label>
                  <Input
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({...formData, features: e.target.value})}
                    placeholder="e.g., King bed, City view, Balcony"
                  />
                </div>

                <div>
                  <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                  <Input
                    id="amenities"
                    value={formData.amenities}
                    onChange={(e) => setFormData({...formData, amenities: e.target.value})}
                    placeholder="e.g., WiFi, TV, Mini bar"
                  />
                </div>

                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({...formData, available: e.target.checked})}
                  />
                  <Label htmlFor="available">Available for booking</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-hero">
                    {editingRoom ? 'Update' : 'Create'} Room
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rooms.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No rooms found. Add your first room!</p>
          ) : (
            rooms.map((room) => (
              <div key={room.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-lg">{room.name}</h4>
                      <Badge variant={room.available ? "default" : "secondary"}>
                        {room.available ? "Available" : "Unavailable"}
                      </Badge>
                      <Badge variant="outline">{room.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{room.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>${room.price}/night</span>
                      <span>{room.capacity} guests</span>
                      <span>{room.size}</span>
                      <span>{room.inventory_count} units</span>
                    </div>
                    {room.features.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-muted-foreground">Features: </span>
                        <span className="text-xs">{room.features.join(', ')}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {room.image_url && (
                      <Button variant="ghost" size="sm">
                        <Image className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(room)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(room.id, room.name)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}