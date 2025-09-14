"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Users } from 'lucide-react';

export interface HouseholdMember {
  id: string;
  nom: string;
  prenom: string;
  sexe: string;
  dateNaissance: string;
}

interface HouseholdMemberFormProps {
  readonly member: HouseholdMember;
  readonly onUpdate: (member: HouseholdMember) => void;
  readonly onRemove: () => void;
  readonly index: number;
}

export default function HouseholdMemberForm({ member, onUpdate, onRemove, index }: HouseholdMemberFormProps) {
  const handleChange = (field: keyof HouseholdMember, value: string) => {
    onUpdate({ ...member, [field]: value });
  };

  const relationSuggested = index === 0 ? 'Conjoint(e)' : `Enfant ${index}`;

  return (
    <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all">
      <div className="flex items-center bg-[#752D8B]/10 p-2 rounded-full">
        <Users className="h-4 w-4 text-[#752D8B]" />
      </div>
      
      <div className="grid grid-cols-12 gap-3 flex-1">
        {/* Numéro/type */}
        <div className="col-span-2 sm:col-span-1">
          <div className="text-sm font-medium text-[#752D8B] flex items-center h-full">
            #{index + 1}
            <span className="hidden sm:inline ml-1 text-xs text-gray-500">({relationSuggested})</span>
          </div>
        </div>
        
        {/* Prénom */}
        <div className="col-span-5 sm:col-span-3">
          <div>
            <Input
              id={`prenom-${member.id}`}
              type="text"
              value={member.prenom}
              onChange={(e) => handleChange('prenom', e.target.value)}
              placeholder="Prénom *"
              className="h-9 text-sm"
              required
            />
          </div>
        </div>
        
        {/* Nom */}
        <div className="col-span-5 sm:col-span-3">
          <div>
            <Input
              id={`nom-${member.id}`}
              type="text"
              value={member.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
              placeholder="Nom *"
              className="h-9 text-sm"
              required
            />
          </div>
        </div>
        
        {/* Sexe */}
        <div className="col-span-6 sm:col-span-2">
          <div>
            <Select value={member.sexe} onValueChange={(value) => handleChange('sexe', value)}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Sexe *" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="femme">Femme</SelectItem>
                <SelectItem value="homme">Homme</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Date de naissance */}
        <div className="col-span-6 sm:col-span-3">
          <div>
            <Input
              id={`dateNaissance-${member.id}`}
              type="date"
              value={member.dateNaissance}
              onChange={(e) => handleChange('dateNaissance', e.target.value)}
              className="h-9 text-sm"
              required
            />
          </div>
        </div>
      </div>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors p-1 h-auto"
        aria-label={`Supprimer le membre ${index + 1} du foyer`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}