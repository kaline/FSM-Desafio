var fsm = {
    alfabeto : ['a','b'],
    estados : ['q0','q1','q2','q3','q4'],
    inicial : 'q0',
    finais : ['q4'],
    programa : {
        a : {
            q0 : "q1",
           
        },
        b : {
            q1 : "q2",
            
        } 
    },
    aceitar : function(stream){
        var atual = this.inicial;
        var i = -1;
        while(++i<stream.length){
            var next = this.programa[stream[i]][atual];
            if(next)
                atual = next;
            else
                throw new Error("Estado de saída desconhecido para {" //
                + stream[i] + "," + atual + "}");
        }
        i = this.finais.length;
        while(i--)
            if(atual == this.finais[i])
                return true;
        return false;
    }
};
