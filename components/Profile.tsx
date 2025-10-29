import React, { useState } from 'react';
import { UserProfile, ExperienceLevel, UserGoal, Gender } from '../types';
import Icon from './Icon';

interface ProfileProps {
  profile: UserProfile;
  onUpdateProfile: (newProfile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'age' || name === 'height' || name === 'weight' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-light">Mi Perfil</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Editar
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-light-dark p-6 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Nombre" name="name" value={formData.name} onChange={handleInputChange} />
            <InputField label="Edad" name="age" type="number" value={formData.age.toString()} onChange={handleInputChange} />
            <SelectField label="Género" name="gender" value={formData.gender} onChange={handleInputChange} options={Object.values(Gender)} />
            <InputField label="Altura (cm)" name="height" type="number" value={formData.height.toString()} onChange={handleInputChange} />
            <InputField label="Peso (kg)" name="weight" type="number" value={formData.weight.toString()} onChange={handleInputChange} />
            <SelectField label="Nivel de Experiencia" name="experience" value={formData.experience} onChange={handleInputChange} options={Object.values(ExperienceLevel)} />
          </div>
          <SelectField label="Objetivo Principal" name="goal" value={formData.goal} onChange={handleInputChange} options={Object.values(UserGoal)} />
          
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => { setIsEditing(false); setFormData(profile); }}
              className="bg-medium text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-light-dark p-6 rounded-lg space-y-4">
          <ProfileInfo label="Nombre" value={profile.name} />
          <ProfileInfo label="Edad" value={profile.age.toString()} />
          <ProfileInfo label="Género" value={profile.gender} />
          <ProfileInfo label="Altura" value={`${profile.height} cm`} />
          <ProfileInfo label="Peso" value={`${profile.weight} kg`} />
          <ProfileInfo label="Nivel de Experiencia" value={profile.experience} />
          <ProfileInfo label="Objetivo Principal" value={profile.goal} />
        </div>
      )}
    </div>
  );
};

interface ProfileInfoProps {
  label: string;
  value: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-gray-700 pb-2">
    <span className="text-gray-400">{label}</span>
    <span className="font-semibold text-light">{value}</span>
  </div>
);


interface InputFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type = "text" }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-dark border border-gray-600 rounded-lg px-3 py-2 text-light focus:ring-primary focus:border-primary"
        />
    </div>
);

interface SelectFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
}
const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, onChange, options }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-dark border border-gray-600 rounded-lg px-3 py-2 text-light focus:ring-primary focus:border-primary"
        >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);


export default Profile;
