import { Buffer } from 'buffer';
import { GenerateProject } from '../model';
import * as dotenv from 'dotenv';

dotenv.config();

const formatCliArgs = (generateTemplate: GenerateProject) => {
  return generateTemplate.values
    .map(({ name, value }) => `-${name} "${value}"`)
    .join(' ');
};

const createWorkflowContent = (generateTemplate: GenerateProject) => {
  return `
name: templi-generate 

on:
  push:
    branches: [ "main" ]

permissions:
  contents: write

jobs:
  process:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Delete all files except .git
        run: |
          find . -mindepth 1 -maxdepth 1 ! -name ".git" -exec rm -rf {} +

      - name: Install Templi
        run: |
          mkdir -p /tmp/templi
          curl -L -o /tmp/templi/templi-cli-linux-x86_64@4.1.1.tar.gz https://github.com/RickaPrincy/Templi/releases/download/v4.1.1/templi-cli-linux-x86_64@4.1.1.tar.gz
          tar -xzf /tmp/templi/templi-cli-linux-x86_64@4.1.1.tar.gz -C /tmp/templi
          echo "/tmp/templi/templi-cli-linux-x86_64@4.1.1/bin" >> $GITHUB_PATH
      
      - name: Generate project 
        run: |
          git config user.name "templi-web[bot]"
          git config user.email "${process.env.GITHUB_EMAIL_ID}+templi-web[bot]@users.noreply.github.com"
          templi generate -t ${generateTemplate.templateUrl}.git ${generateTemplate.scope ? `-s ${generateTemplate.scope}` : ''} -o generated ${formatCliArgs(generateTemplate)}

      - name: Move generated files to root
        run: |
          shopt -s dotglob
          mv generated/* .
          rm -rf generated

      - name: Rename .github folder since it's not allowed
        run: |
          if [ -d ".github" ]; then
            mv .github __github__
          fi

      - name: Commit changes
        run: |
          git add --all 
          git commit -m "chore: generate project with templi" || echo "Nothing to commit"

      - name: Push changes
        uses: ad-m/github-push-action@v0.8.0
        with:
          github_token: $\{{ secrets.GITHUB_TOKEN }}
`;
};

export const generateWorkflowFile = (payload: GenerateProject) => {
  return Buffer.from(createWorkflowContent(payload)).toString('base64');
};
