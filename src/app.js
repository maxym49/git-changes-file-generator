import cmd from 'node-cmd';
import fs from 'fs';
import path from 'path';
import commander from 'commander';
import readline from 'readline';
import process from 'process';
import regeneratorRuntime from 'regenerator-runtime';
import { Zipper } from './tools/zipper';
import {
  welcome,
  provideDrive,
  provideRepoPath,
  provideLastCommit,
  provideBeforeMergeCommit,
  destinationToSaveZip,
  badFormat
} from './constants/text';
import { cyan, red, green, yellow, purple } from './constants/colors';

const program = new commander.Command();
program.version('0.0.1');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const question = (theQuestion, color = '\x1b[32m', space = true) => {
  if (space) console.log();
  process.stdout.write(color, '');
  return new Promise(resolve =>
    rl.question(`${theQuestion}\n`, answ => resolve(answ))
  );
};

const askQuestions = async (notValid = false) => {
  if (!notValid) await question(welcome, cyan, false);
  else console.error(red, badFormat);
  const drive = await question(provideDrive, purple, false);
  if (!drive.length) askQuestions(true);
  const repoPath = await question(provideRepoPath, yellow);
  if (!repoPath.length) askQuestions(true);
  const lastCommit = await question(provideLastCommit, green);
  if (!lastCommit.length) askQuestions(true);
  const beforeMergeCommit = await question(provideBeforeMergeCommit, purple);
  if (!beforeMergeCommit.length) askQuestions(true);
  const zipPath = await question(destinationToSaveZip, yellow);
  if (!zipPath.length) askQuestions(true);
  const command = `git diff --name-only ${lastCommit} ${beforeMergeCommit}`;
  const zip = new Zipper();
  const commandData = {
    command,
    drive,
    repoPath
  };
  const data = {
    repoPath,
    zipPath
  };
  runCommand(commandData, zip, data);
};

const runCommand = (commandData, zip, data) => {
  const { command, drive, repoPath } = commandData;
  cmd.get(`${drive} & cd ${repoPath} & ${command}`, (err, lines) => {
    if (!err) {
      saveChangesAsFiles(lines, zip, data);
    } else {
      askQuestions();
    }
  });
};

const saveChangesAsFiles = (d, zip, data) => {
  const { repoPath, zipPath } = data;
  const lines = d.split('\n');
  const deletedPath = '../static/temp/deleted';
  for (let i = 0; i < lines.length - 1; i++) {
    const fileName = lines[i].split('/').pop();
    if (fs.existsSync(path.join(repoPath, lines[i]))) {
      const filePath = path.join(repoPath, lines[i]);
      zip.addFileToZip(filePath, 'edited');
    } else {
      const file = fs.createWriteStream(
        path.join(__dirname, deletedPath, fileName)
      );
      file.close();
      zip.addFileToZip(path.join(__dirname, deletedPath, fileName), 'deleted');
      fs.unlink(path.join(__dirname, deletedPath, fileName), err => {
        if (err) console.error(err);
      });
    }
  }
  console.log(cyan, `Files have been saved to ${zipPath}/gitChanges.zip`);
  zip.saveZip(`${zipPath}/gitChanges.zip`);
};

const runApp = () => {
  askQuestions();
};

runApp();
