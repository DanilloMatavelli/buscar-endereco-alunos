const datetimeElement = document.querySelector('.header__datetime');

const formatarDataHora = () => {
    const agora = new Date();
    const diasSemana = ['Domingo' , 'Segunda-Feira' , 'Terça-Feira' , 'Quarta-Feira' , 'Quinta-Feira' , 'Sexta-Feira' , 'Sabado'];
    //Obtém e formata os componentes da data
    const dia = agora.getDate().toString().padStart(2, '0');
    const mes = (agora.getMonth() + 1).toString().padStart(2, '0');
    const ano = agora.getFullYear();
    const diaSemana = diasSemana[agora.getDay()];

    //Obtém e formata os componentes horário
    const hora = agora.getHours().toString().padStart(2, '0');
    const minuto = agora.getMinutes().toString().padStart(2, '0');
    const segundo = agora.getSeconds().toString().padStart(2, '0');

    return `${diaSemana}, ${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;
}

// Função que atualiza o cabeçalho com a saudação
const atualizarHeader = () => {
    datetimeElement.textContent = formatarDataHora();
};

//Atualizar header a cada segundo
setInterval(atualizarHeader, 1000);

// Inicializar header
atualizarHeader();
