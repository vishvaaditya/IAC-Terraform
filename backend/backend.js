const express = require('express');
const axios = require('axios');
const fs = require('fs').promises;
const cors = require('cors');
const { execSync } = require('child_process');
const crypto = require('crypto');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const githubToken = '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'; // Replace with your GitHub token
const repoOwner = 'vishvaaditya';
const repoName = 'IAC-Terraform';
const filePath = 'E:/IAC-Portal-React/backend/main.tf'; // Adjust the path to your main.tf file

// Function to get the latest commit SHA for a specific branch
function getLatestCommitSha(defaultBranch = 'main') {
  try {
    // Execute Git command to get the latest commit SHA for the specified branch
    const command = `"C:\\Program Files\\Git\\bin\\" git rev-parse ${defaultBranch}`;
    const latestCommitSha = execSync(command, { encoding: 'utf-8' }).trim();
    return latestCommitSha;
  } catch (error) {
    console.error('Error getting latest commit SHA:', error);
    return null;
  }
}

app.post('/update-terraform', async (req, res) => {
  const { instanceType, instanceName, amiId } = req.body;

  try {
    // Read the current content of main.tf
    const currentContent = await fs.readFile(filePath, 'utf-8');

    // Replace placeholders with user input
    const updatedContent = currentContent
      .replace(/instanceType/g, instanceType)
      .replace(/instanceName/g, instanceName)
      .replace(/amiId/g, amiId);

    // Write the updated content back to main.tf
    await fs.writeFile(filePath, updatedContent, 'utf-8');

    // Generate a new SHA for the commit
    const newCommitSha = getLatestCommitSha('test');
    console.log(newCommitSha)

    // Commit and push changes to GitHub with the new commit SHA
    await axios.post(`https://api.github.com/repos/${repoOwner}/${repoName}/git/refs`, {
      ref: 'refs/heads/test',
      sha: newCommitSha,
    }, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
    });

    res.status(200).json({ message: 'Update and trigger successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
