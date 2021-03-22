const fsm2 = {
    alfabeto: ["08:00", "12:00", "13:00", "18:00", "22:00"],
    estados: ["acordado", "trabalhando", "descansando", "dormindo"],
    inicial: "dormindo",
    atual: "dormindo",
    finais: ["dormindo"],
    programa: {
      "08:00": {
        dormindo: "acordado",
        acordado: "trabalhando",
      },
      "12:00": {
        dormindo: "trabalhando",
        acordado: "trabalhando",
        trabalhando: "descansando",
      },
      "13:00": {
        trabalhando: "trabalhando",
        descansando: "trabalhando",
      },
      "18:00": {
        trabalhando: "descansando",
      },
      "22:00": {
        descansando: "dormindo",
        trabalhando: "descansando",
        dormindo: "dormindo",
      },
    },
    passo(s) {
      if (!this.alfabeto.find((a) => a == s))
        throw new Error(`Símbolo ${s} não existe no alfabeto ${this.alfabeto}`);
      let next = this.programa[s][this.atual];
      if (next) {
        console.log(`São ${s}, estava ${this.atual} e agora estou ${next}`);
        this.atual = next;
      } else
        throw new Error(`Estado de saída desconhecido para {${s},${this.atual}}`);
    },
    aceitar(stream) {
      let i = -1;
      while (++i < stream.length) this.passo(stream[i]);
      i = this.finais.length;
      while (i--) if (this.atual == this.finais[i]) return true;
      return false;
    },
  };
  
  const [prog, script, ...palavra] = process.argv;
  if (!palavra) {
    console.log("Uso: node fsm2.js 08:00 12:00 13:00 18:00 22:00");
    return;
  }

  
    console.log("Palavra: " + palavra);
    const aceita = fsm2.aceitar(palavra);
    console.log(`A palavra ${aceita ? "" : "não"} foi aceita`);
    console.log(fsm2);

    console.log(Object.keys(fsm2.programa));
  
    Object.keys(fsm2.programa).map(key => console.log(fsm2.programa[key]))
  