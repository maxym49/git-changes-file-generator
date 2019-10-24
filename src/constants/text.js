import emoji from 'node-emoji';

const welcome = `${emoji.get(':star:')}  Hello human
${emoji.get(':star:')}  This tool allows you to get changed files from GIT.
${emoji.get(':star:')}  If you are ready press the ENTER!`;
const provideDrive = 'Provide the repo drive (for example c:)';
const provideRepoPath =
  'Provide the full path of your repo (for example C:\\myproject)';
const provideLastCommit =
  'Provide the commit hash (for example 3a4a846bawdeda8e689acd977a91b4e53271152be3a)';
const provideBeforeMergeCommit =
  'Provide the next commit hash to compare both (for example 3a4a846bawdeda8e689acd977a91b4e53271152be3a)';
const destinationToSaveZip =
  'Provide the path to save ZIP (for example C:\\myZIP)';
const badFormat = `This format can crash the app, please retype all data`;

export {
  welcome,
  provideDrive,
  provideRepoPath,
  provideLastCommit,
  provideBeforeMergeCommit,
  destinationToSaveZip,
  badFormat
};
