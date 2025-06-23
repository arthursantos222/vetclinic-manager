import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPets() {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://685997d09f6ef9611153a5fd.mockapi.io/pets"
        );
        // Pega os 5 pets mais recentes (os últimos 5 do array)
        const recentPets = res.data.slice(-5).reverse();
        setPets(recentPets);

        // Para cada pet, buscar imagem do Dog CEO
        const imgs = {};
        await Promise.all(
          recentPets.map(async (pet) => {
            const imgRes = await axios.get(
              "https://dog.ceo/api/breeds/image/random"
            );
            imgs[pet.id] = imgRes.data.message;
          })
        );
        setImages(imgs);
      } catch (err) {
        console.error("Erro ao buscar pets:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPets();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-green-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-green-800">
        Bem-vindo ao VetClinic!
      </h1>

      {loading ? (
        <p>Carregando pets...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded shadow p-4 flex flex-col items-center hover:shadow-lg transition"
            >
              <img
                src={images[pet.id]}
                alt={pet.breed}
                className="w-40 h-40 object-cover rounded mb-4"
              />
              <h2 className="text-xl font-semibold">{pet.name}</h2>
              <p>Raça: {pet.breed}</p>
              <p>Tutor: {pet.owner}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate("/login")}
        className="mt-10 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
      >
        Acesso Funcionário
      </button>
    </div>
  );
}
