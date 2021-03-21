let [a, b, ...stream] = process.argv

var fsm = {
    transicoes : ['8:00h', '12:00h', '13:00h', '18:00h', '22:00h' ],
    estados : ['acordado','trabalhando','descansando','dormindo'],
    inicial : 'acordado',
    finais : ['dormindo'],
    programa : {
        "8:00h" : {
            acordado : "trabalhando",
           
        },
       
        "12:00h" : {
            trabalhando:"descansando",
           
            
        },

        "13:00h" : {
            descansando:"trabalhando",
           
            
        }, 

        "18:00h" : {
            trabalhando:"descansando",
           
            
        },

        "22:00h" : {
           descansando:"dormindo",
            
        } 
    },

    
    aceitar : function(stream){
        
        var atual = this.inicial;
        var i = -1;
        while(++i<stream.length){
          
            var prog = this.programa[stream[i]];
            if(prog){
                var next = prog[atual];

            }else{
                console.log('Entrada inválida')
            }
        

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

try{
    console.log(fsm.aceitar(stream) ? "palavra aceita":"deu ruim");
    console.log(JSON.stringify(fsm))

}catch(ex){
    console.log('Entrada inválida');
}
