declare const window: any;

export interface Options {
	filename: string;
	fieldSeparator: string;
	quoteStrings: string;
	decimalseparator: string;
	showLabels: boolean;
	showTitle: boolean;
	title: string;
	useBom: boolean;
	headers: string[];
}

export class TxtConfigConsts {

	static EOL = "\r\n";
	static BOM = "\ufeff";

	static DEFAULT_FIELD_SEPARATOR = ',';
	static DEFAULT_DECIMAL_SEPARATOR = '.';
	static DEFAULT_QUOTE = '"';
	static DEFAULT_SHOW_TITLE = false;
	static DEFAULT_TITLE = 'My Report';
	static DEFAULT_FILENAME = 'mytest.txt';
	static DEFAULT_SHOW_LABELS = false;
	static DEFAULT_USE_BOM = true;
	static DEFAULT_HEADER = [];

}

export const ConfigDefaults: Options = {
	filename: TxtConfigConsts.DEFAULT_FILENAME,
	fieldSeparator: TxtConfigConsts.DEFAULT_FIELD_SEPARATOR,
	quoteStrings: TxtConfigConsts.DEFAULT_QUOTE,
	decimalseparator: TxtConfigConsts.DEFAULT_DECIMAL_SEPARATOR,
	showLabels: TxtConfigConsts.DEFAULT_SHOW_LABELS,
	showTitle: TxtConfigConsts.DEFAULT_SHOW_TITLE,
	title: TxtConfigConsts.DEFAULT_TITLE,
	useBom: TxtConfigConsts.DEFAULT_USE_BOM,
	headers: TxtConfigConsts.DEFAULT_HEADER
};

import { EnvironmentService } from "@core/general/environment-service/environment.service";
import { StorageService } from "@core/general/storage-service/storage.service";
import { SessionStorageService } from 'ngx-webstorage';

export class AerumBackupFile {
  private isMobileBuild = (new EnvironmentService(new StorageService(new SessionStorageService()))).get().isMobileBuild;
	fileName: string;
	labels: String[];
	data: any[];

	private _options: Options;
	private txt = "";

	constructor(DataJSON: any, filename: string, options?: any) {
		const config = options || {};

		this.data = typeof DataJSON != 'object' ? JSON.parse(DataJSON) : DataJSON;

		this._options = objectAssign({}, ConfigDefaults, config);

		if (this._options.filename) {
			this._options.filename = filename;
		}

		this.generateTxt();
	}
	/**
	 * Generate and Download Txt
	 */
	private async generateTxt() {
		if (this._options.useBom) {
			this.txt += TxtConfigConsts.BOM;
		}

		if (this._options.showTitle) {
			this.txt += this._options.title + '\r\n\n';
		}

		this.getHeaders();
		this.getBody();

		if (this.txt === '') {
			console.log("Invalid data");
			return;
		}

		const blob = new Blob([this.txt], { "type": "text/plain;charset=utf8;" });

    if (this.isMobileBuild) {
      return await this.generateFileMobile(blob);
    }
    return this.generateFileWeb(blob);
  }

  async generateFileWeb(data) {
    if (navigator.msSaveBlob) {
			const filename = this._options.filename.replace(/ /g, "_") + ".txt";
			navigator.msSaveBlob(data, filename);
		} else {
			const uri = 'data:attachment/txt;charset=utf-8,' + encodeURI(this.txt);
			const link = document.createElement("a");

			link.href = URL.createObjectURL(data);

			link.setAttribute('visibility', 'hidden');
			link.download = this._options.filename.replace(/ /g, "_") + ".txt";

			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
  }

  generateFileMobile(blob) {
    const filename = this._options.filename.replace(/ /g, "_") + ".txt";
    const promise = new Promise<string>(
      (resolve, reject): void => {
        window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, fs => {
          let dirPath = 'Fuchsia';
          let filePath = dirPath + '/' + filename;
          if(window.device.platform === 'iOS') {
            dirPath = '/';
            filePath = filename;
          }
          fs.root.getDirectory(dirPath, { create: true, exclusive: false }, () => {
            fs.root.getFile(filePath, { create: true, exclusive: false }, async fileEntry => {
              await this.writeFile(fileEntry, blob);
              resolve();
            }, err => reject(err));
          }, err => reject(err));
        }, err => reject(err));
    });
    return promise;
  }

  writeFile(fileEntry, dataObj) {
    const promise = new Promise<string>(
      (resolve, reject): void => {
        fileEntry.createWriter(fileWriter => {
          fileWriter.onwriteend = () => resolve();
          fileWriter.onerror = err => reject(err);
          fileWriter.write(dataObj);
      });
    });
    return promise;
  }

	/**
	 * Create Headers
	 */
	getHeaders(): void {
		if (this._options.headers.length > 0) {
			let row = "";
			for (const column of this._options.headers) {
				row += column + this._options.fieldSeparator;
			}

			row = row.slice(0, -1);
			this.txt += row + TxtConfigConsts.EOL;
		}
	}
	/**
	 * Create Body
	 */
	getBody() {
		for (let i = 0; i < this.data.length; i++) {
			let row = "";
			for (const index in this.data[i]) {
				row += this.formartData(this.data[i][index]) + this._options.fieldSeparator;
			}

			row = row.slice(0, -1);
			this.txt += row + TxtConfigConsts.EOL;
		}
	}
	/**
	 * Format Data
	 * @param {any} data
	 */
	formartData(data: any) {

		// if (this._options.decimalseparator === 'locale' && this.isFloat(data)) {
		// 	return data.toLocaleString();
		// }

		// if (this._options.decimalseparator !== '.' && this.isFloat(data)) {
		// 	return data.toString().replace('.', this._options.decimalseparator);
		// }

		// if (typeof data === 'string') {
		// 	if (this._options.quoteStrings || data.indexOf(',') > -1 || data.indexOf('\n') > -1 || data.indexOf('\r') > -1) {
		// 		data = this._options.quoteStrings + data + this._options.quoteStrings;
		// 	}
		// 	return data;
		// }

		// if (typeof data === 'boolean') {
		// 	return data ? 'TRUE' : 'FALSE';
		// }
		return data.replace(/"/g, '""');
	}
	/**
	 * Check if is Float
	 * @param {any} input
	 */
	isFloat(input: any) {
		return +input === input && (!isFinite(input) || Boolean(input % 1));
	}
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
const propIsEnumerable = Object.prototype.propertyIsEnumerable;

/**
 * Convet to Object
 * @param {any} val
 */
function toObject(val: any) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}
	return Object(val);
}
/**
 * Assign data  to new Object
 * @param {any}   target
 * @param {any[]} ...source
 */
function objectAssign(target: any, ...source: any[]) {
	let from: any;
	const to = toObject(target);
	let symbols: any;

	for (let s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (const key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if ((Object as any).getOwnPropertySymbols) {
			symbols = (Object as any).getOwnPropertySymbols(from);
			for (let i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}
	return to;
}
