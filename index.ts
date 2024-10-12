import express from 'express';
import { Octokit } from "@octokit/core";
import { Buffer } from 'buffer';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/github/upload', async (req, res) => {
  const { token, username, repo, path, file, message } = req.body;

  if (!token || !username || !repo || !path || !file || !message) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const octokit = new Octokit({
    auth: token
  });

  try {
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: username,
      repo: repo,
      path: path,
      message: message,
      committer: {
        name: 'Jonell Magallanes',
        email: 'your-email@example.com'
      },
      content: Buffer.from(file).toString('base64'),
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    res.status(200).json({ success: true, message: 'File uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
//ccprojectsjonellapis 