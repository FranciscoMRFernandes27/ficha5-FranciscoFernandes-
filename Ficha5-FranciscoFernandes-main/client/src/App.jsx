import { useState, useEffect } from "react";
import Card from "./Card.jsx";

const emptyForm = { name: "", type: "Criatura", attack: "" };

function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");
  const [randomCard, setRandomCard] = useState(null);
  const [sorted, setSorted] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/cartas")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setCards(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError(null);
    setSending(true);

    const card = {
      name: form.name.trim(),
      type: form.type,
      attack: Number(form.attack) || 0,
    };

    try {
      const res = await fetch("http://localhost:3000/api/cartas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(card),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const savedCard = await res.json();
      setCards((current) => [...current, savedCard]);
      setForm(emptyForm);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSending(false);
    }
  }

  let visible = cards
    .filter((card) => filter === "Todas" || card.type === filter)
    .filter((card) => card.name.toLowerCase().includes(search.toLowerCase()));

  if (sorted) {
    visible = [...visible].sort((a, b) => b.attack - a.attack);
  }

  function pickRandom() {
    fetch("http://localhost:3000/api/cartas/aleatoria")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setRandomCard(data))
      .catch((err) => console.error(err));
  }

  if (loading) {
    return (
      <main>
        <h1>A minha coleção</h1>
        <p>A carregar…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>A minha coleção</h1>
        <p>Não foi possível carregar as cartas: {error}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>A minha coleção</h1>

      <p>
        Tenho {cards.length} cartas · a mostrar {visible.length}
      </p>

      <h2>Acrescentar carta</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nome
          <input name="name" value={form.name} onChange={handleChange} />
        </label>
        <label>
          Tipo
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="Criatura">Criatura</option>
            <option value="Feitiço">Feitiço</option>
          </select>
        </label>
        <label>
          Ataque
          <input
            name="attack"
            type="number"
            min="0"
            value={form.attack}
            onChange={handleChange}
          />
        </label>
        <button type="submit" disabled={sending}>
          {sending ? "A enviar…" : "Acrescentar"}
        </button>
      </form>
      {formError && <p>Erro ao acrescentar: {formError}</p>}

      <div>
        <button onClick={() => setFilter("Todas")}>Todas</button>
        <button onClick={() => setFilter("Criatura")}>Só criaturas</button>
        <button onClick={() => setFilter("Feitiço")}>Só feitiços</button>
        <button onClick={() => setSorted(!sorted)}>
          {sorted ? "Ordem original" : "Ordenar por ataque"}
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Procurar pelo nome…"
      />

      {visible.length === 0 ? (
        <p>Nenhuma carta corresponde.</p>
      ) : (
        <ul>
          {visible.map((card, index) => (
            <Card key={`${card.name}-${index}`} {...card} />
          ))}
        </ul>
      )}

      <h2>Carta à sorte</h2>
      <button onClick={pickRandom}>Escolher outra</button>
      {randomCard && (
        <p>
          <b>{randomCard.name}</b> — {randomCard.type} · ataque {randomCard.attack} ·
          defesa {randomCard.defense}
        </p>
      )}
    </main>
  );
}

export default App;
