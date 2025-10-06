import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RoomUnit {
  id: string;
  code: string;
  status: string;
  room_id: string;
}

interface SubroomsManagerProps {
  roomId: string;
}

export default function SubroomsManager({ roomId }: SubroomsManagerProps) {
  const [units, setUnits] = useState<RoomUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUnit, setEditingUnit] = useState<RoomUnit | null>(null);
  const [code, setCode] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchUnits();
  }, [roomId]);

  const fetchUnits = async () => {
    try {
      const { data, error } = await supabase
        .from('room_units')
        .select('*')
        .eq('room_id', roomId)
        .order('code', { ascending: true });
      
      if (error) throw error;
      setUnits(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUnit) {
        const { error } = await supabase
          .from('room_units')
          .update({ code })
          .eq('id', editingUnit.id);
        
        if (error) throw error;
        
        toast({
          title: "Sous-chambre mise à jour",
          description: "La sous-chambre a été mise à jour avec succès.",
        });
      } else {
        const { error } = await supabase
          .from('room_units')
          .insert({
            room_id: roomId,
            code,
            status: 'available'
          });
        
        if (error) throw error;
        
        toast({
          title: "Sous-chambre créée",
          description: "La nouvelle sous-chambre a été créée avec succès.",
        });
      }

      setCode("");
      setEditingUnit(null);
      fetchUnits();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    }
  };

  const handleEdit = (unit: RoomUnit) => {
    setEditingUnit(unit);
    setCode(unit.code);
  };

  const handleDelete = async (unitId: string, unitCode: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${unitCode}"?`)) return;
    
    try {
      const { error } = await supabase
        .from('room_units')
        .delete()
        .eq('id', unitId);
      
      if (error) throw error;
      
      toast({
        title: "Sous-chambre supprimée",
        description: "La sous-chambre a été supprimée avec succès.",
      });
      
      fetchUnits();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    }
  };

  const updateAvailability = async () => {
    try {
      const { error } = await supabase.rpc('update_room_unit_availability');
      
      if (error) throw error;
      
      toast({
        title: "Disponibilité mise à jour",
        description: "La disponibilité a été actualisée.",
      });
      
      fetchUnits();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    }
  };

  if (loading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Sous-chambres ({units.length})</h3>
        <Button onClick={updateAvailability} variant="outline" size="sm">
          Actualiser disponibilité
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="code">Code de la sous-chambre</Label>
          <Input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="ex: 101, 102, 103..."
            required
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" className="bg-gradient-hero">
            <Plus className="h-4 w-4 mr-2" />
            {editingUnit ? 'Modifier' : 'Ajouter'}
          </Button>
          {editingUnit && (
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => {
                setEditingUnit(null);
                setCode("");
              }}
            >
              Annuler
            </Button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        {units.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Aucune sous-chambre. Ajoutez-en une!
          </p>
        ) : (
          units.map((unit) => (
            <div 
              key={unit.id} 
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{unit.code}</span>
                <Badge variant={unit.status === 'available' ? 'default' : 'secondary'}>
                  {unit.status === 'available' ? 'Disponible' : 'Occupée'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleEdit(unit)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDelete(unit.id, unit.code)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
