import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [images, setImages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPets() {
      setLoading(true);
      try {
        const res = await axios.get("https://685997d09f6ef9611153a5fd.mockapi.io/pets");
        setPets(res.data);
      } catch (error) {
        console.error("Erro ao buscar pets", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPets();
  }, []);

  if (!user) {
    return <p>Carregando usuário...</p>;
  }

  const uniqueBreeds = [...new Set(pets.map(pet => pet.breed))];
  const filteredPets = selectedBreed ? pets.filter(pet => pet.breed === selectedBreed) : pets;

  useEffect(() => {
    async function fetchImages() {
      const newImages = {};
      for (const pet of filteredPets) {
        try {
          const res = await axios.get("https://dog.ceo/api/breeds/image/random");
          newImages[pet.id] = res.data.message;
        } catch {
          newImages[pet.id] = "";
        }
      }
      setImages(newImages);
    }
    fetchImages();
  }, [filteredPets]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (loading) return <p className="p-4 text-center">Carregando pets...</p>;

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Olá, {user?.name || "Usuário"}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </header>

      <div className="mb-4">
        <label className="font-semibold mr-2">Filtrar por raça:</label>
        <select
          value={selectedBreed}
          onChange={e => setSelectedBreed(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">Todas as raças</option>
          {uniqueBreeds.map(breed => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPets.map(pet => (
          <div
            key={pet.id}
            className="bg-white p-4 rounded shadow hover:shadow-lg transition"
          >
            <img
              src={images[pet.id]}
              alt={pet.breed}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="font-bold text-lg">{pet.name || "Nome não disponível"}</h2>
            <p>Raça: {pet.breed || "Não informado"}</p>
            <p>Idade: {pet.age ?? "?"} anos</p>
            <p>Tutor: {pet.owner || "Desconhecido"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
