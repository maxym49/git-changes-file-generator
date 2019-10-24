import AdmZip from 'adm-zip';

export class Zipper {
  constructor() {
    this.zip = new AdmZip();
  }

  addFileToZip(path, zipPath) {
    this.zip.addLocalFile(path, zipPath);
  }

  saveZip(path) {
    this.zip.writeZip(path);
  }

  get zip() {
    return this._zip;
  }

  set zip(zip) {
    this._zip = zip;
  }
}
