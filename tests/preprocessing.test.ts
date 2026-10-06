import assert from "node:assert/strict";
import test from "node:test";
import { preprocessText, tokenize } from "../lib/preprocessing";

test("tokenizer mempertahankan skor, tagar, dan emoji", () => {
  const tokens = tokenize("Timnas menang 3-0! #Garuda 🔥");
  assert.ok(tokens.includes("3-0"));
  assert.ok(tokens.includes("#Garuda"));
  assert.ok(tokens.includes("🔥"));
});

test("normalisasi informal mengubah nggak menjadi tidak", () => {
  const result = preprocessText("Aku nggak sukaaa ini", {
    normalizeSlang: true,
    normalizeRepeated: true,
    lowercase: true,
    removeStopwords: false,
    stemming: false,
  });
  assert.ok(result.tokens.includes("tidak"));
  assert.ok(result.tokens.includes("suka"));
});

test("penghapusan kata henti memberi peringatan saat negasi terhapus", () => {
  const result = preprocessText("Saya tidak suka film ini", {
    removeStopwords: true,
    normalizeSlang: false,
    stemming: false,
  });
  assert.ok(result.warnings.some((item) => item.toLowerCase().includes("negasi")));
});
