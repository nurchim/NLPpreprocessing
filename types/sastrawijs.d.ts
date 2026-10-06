/**
 * Deklarasi tipe lokal untuk sastrawijs@1.1.0.
 *
 * Paket sastrawijs sudah menyertakan dist/index.d.ts, tetapi versi 1.1.0
 * belum mengekspornya melalui package.json "exports". Dengan
 * moduleResolution="bundler" (standar Next.js), TypeScript tidak dapat
 * menjangkau deklarasi bawaan tersebut. Deklarasi minimal ini menjaga
 * pemeriksaan tipe tanpa mengubah perilaku runtime pustaka.
 */
declare module "sastrawijs" {
  export class Stemmer {
    constructor(dictionary?: string[]);
    stem(word: string): string;
  }

  export class Tokenizer {
    constructor();
    tokenize(text: string): string[];
  }
}
