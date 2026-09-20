import React, { useState } from 'react';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ nom: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Chargement...');

    // Définir l'URL selon si on s'inscrit ou si on se connecte
    const endpoint = isLogin ? '/login' : '/register';

    try {
      const response = await fetch(`https://helloconnect-backend.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: formData.nom || formData.name || formData.username,
          email: formData.email,
          mot_de_passe: formData.mot_de_passe || formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Succès : ${data.message}`);
        if (data.user) {
          console.log('Utilisateur connecté/inscrit :', data.user);
        }
      } else {
        setMessage(`Erreur : ${data.error}`);
      }
    } catch (error) {
      setMessage("Erreur de connexion au serveur Node.js.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>{isLogin ? 'Connexion' : 'Inscription'}</h2>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              name="nom"
              placeholder="Votre nom"
              value={formData.nom}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
        )}

        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            name="email"
            placeholder="Votre email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          {isLogin ? 'Se connecter' : "S'inscrire"}
        </button>
      </form>

      {message && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{message}</p>}

      <button
        onClick={() => setIsLogin(!isLogin)}
        style={{ marginTop: '20px', background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
      >
        {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
      </button>
    </div>
  );
}

export default Auth;
