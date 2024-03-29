import executeQuery from "@/Config/db4";

export default async function handler(req, res) {
  const args = req.query.args
  try {
    // Exécuter la requête SQL pour récupérer les videos
    const rows = await executeQuery('SELECT * FROM posts WHERE posts.Visible = 0 AND posts.User =?', args);

    // Renvoyer les résultats de la requête sous forme de réponse JSON
    res.status(200).json(rows);
  } catch (error) {
    // Gérer les erreurs de manière appropriée
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des commentaires.' });
  }
}