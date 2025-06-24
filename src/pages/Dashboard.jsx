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

  const uniqueBreeds = [...new Set(pets.map((pet) => pet.breed))];

  const filteredPets = selectedBreed
    ? pets.filter((pet) => pet.breed === selectedBreed)
    : pets;

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

  if (loading)
    return (
      <p className="p-4 text-center text-gray-600 text-lg">Carregando pets...</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-50 to-green-100 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-900">
          Olá, <span className="text-green-700">{user?.name || "Usuário"}</span>
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded shadow"
        >
          Logout
        </button>
      </header>

      <div className="mb-6 max-w-sm">
        <label
          htmlFor="breed-filter"
          className="block font-semibold text-green-800 mb-2"
        >
          Filtrar por raça:
        </label>
        <select
          id="breed-filter"
          value={selectedBreed}
          onChange={(e) => setSelectedBreed(e.target.value)}
          className="w-full rounded border border-green-400 p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <option value="">Todas as raças</option>
          {uniqueBreeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {filteredPets.map((pet) => (
          <div
            key={pet.id}
            className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition"
          >
            <img
              src={images[pet.id]}
              alt={pet.breed}
              className="w-full h-52 object-cover rounded-lg mb-4"
            />
            <h2 className="font-bold text-2xl text-green-800">{pet.name}</h2>
            <p className="text-gray-700 mt-1">Raça: {pet.breed}</p>
            <p className="text-gray-600 mt-1">Idade: {pet.age} anos</p>
            <p className="text-gray-600 mt-1">Tutor: {pet.owner}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
