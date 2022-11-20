const STORAGE_KEY = 'DEVINKNOWLEDGE';
const cards = []
var editando = false;
var idCardEdit;
var idCardDelete;
const categorias = [
    {
      id: 1,
      nome: 'FrontEnd',
    },
    {
      id: 2,
      nome: 'BackEnd',
    },
    {
      id: 3,
      nome: 'FullStack',
    },
    {
      id: 4,
      nome: 'SoftSkill',
    },
  ];

function renderCategory() {
    const categoria = document.getElementById('category');

    categorias.forEach(elemento => {
        const opcao = document.createElement('option');
        opcao.innerText = elemento.nome;
        opcao.value = elemento.id;
        categoria.appendChild(opcao);
    })
}

function renderCards(arrayCards = cards) {
    const lista = document.getElementById('cards');
    lista.innerHTML = '';

    arrayCards.forEach((elemento) => {
        const li = document.createElement('li');
        li.classList.add('list-i-card', 'list-i-cards');
        // TITULO
        const titulo = document.createElement('h2');
        titulo.innerText = elemento.titulo;

        titulo.classList.add('text-center');
        li.appendChild(titulo);

        // ID
        const id = document.createElement('p');
        id.innerText = elemento.id;

        id.classList.add('id_hide');

        li.appendChild(id);

        // Linguagem/Skill 
        const lingSkill = document.createElement('p');

        lingSkill.innerText = `Linguagem/Skill: ${elemento.skill}`;

        li.appendChild(lingSkill);
        // CATEGORIA
        const categoria = document.createElement('p');

        categoria.innerText = `Categoria: ` + getCategoryName(elemento.categoria);

        li.appendChild(categoria);
        // Descrição
        const desc = document.createElement('p');

        desc.innerText = elemento.descricao;

        li.appendChild(desc);
        // Vídeo do yt
        const video = elemento.video;  
        
        // Botao editar, lixo e video
        const divIcone = document.createElement('div');
        divIcone.id = 'div-icone';
        divIcone.classList.add('div-icone');
        const imgEdit = document.createElement('img');
        imgEdit.id = 'edit';
        imgEdit.src = "./assets/editIcon.png";
        imgEdit.alt = "Botão para editar o card";
        const botaoEditar = document.createElement('button');
        botaoEditar.classList.add('button-icon-edit');
        botaoEditar.appendChild(imgEdit);
        divIcone.appendChild(botaoEditar);

        const imgTrash = document.createElement('img');
        imgTrash.id = 'trash';
        imgTrash.src = "./assets/TrashIcon.png";
        imgTrash.alt = "Botão para deletar o card";
        const botaoLixo = document.createElement('button');
        botaoLixo.classList.add('button-icon-trash');
        botaoLixo.appendChild(imgTrash);
        divIcone.appendChild(botaoLixo);

        const imgVideo = document.createElement('img');
        imgVideo.id = 'video';
        imgVideo.src = "./assets/videoIcon.png";
        imgVideo.alt = "Botão para visualizar o video do card";
        const botaoVideo = document.createElement('button');
        const linkVideo = document.createElement('a');
        linkVideo.href = video;
        botaoVideo.classList.add('button-icon-video');
        botaoVideo.appendChild(linkVideo);
        linkVideo.appendChild(imgVideo);
        divIcone.appendChild(botaoVideo);

        li.appendChild(divIcone);
        lista.appendChild(li);

        botaoEditar.addEventListener('click', () => {
            editando = true;
            swal({
                title: "EDITANDO!",
                text: "Editando o card!",
                button: true,
              });
              filtraTotal();
              idCardEdit = parseInt(divIcone.parentElement.children[1].innerHTML);
              formulario.querySelector('button[type="submit"]').textContent = "Salvar";
              document.getElementById('form_titulo').value = divIcone.parentElement.children[0].innerHTML
              document.getElementById('form_skill').value = divIcone.parentElement.children[2].innerHTML.split(":")[1];
              document.getElementById('category').value = getCategoryID(divIcone.parentElement.children[3].innerHTML);
              document.getElementById('description').value = divIcone.parentElement.children[4].innerHTML
              document.getElementById('form_youtube').value = divIcone.parentElement.children[5].lastChild.firstChild.href  
              return idCardEdit;  
        })


        botaoLixo.addEventListener('click', function(){
            swal("DELETANDO!", "Você tem certeza de que deseja deletar esse card?", {
                buttons: {nao: "Não", 
                          sim: "Sim",},
            })
            .then((value) => {
                switch (value) {
                    case "nao":
                        break;
                    case "sim":
                        idCardDelete = parseInt(divIcone.parentElement.children[1].innerHTML);
                        removeElementoArray(idCardDelete);
                        console.log(cards);
                        loadData()
                        swal({
                            title: "Deletado!",
                            text: "Card deletado com sucesso",
                            icon: "success",
                            button: true,
                          });
                }
            }) 
            
        })
    })
}

function renderTotal() {
    const lista = document.getElementById('totais');
    lista.innerHTML = '';
  
    const li = document.createElement('li');
    li.classList.add('list-item', 'list-item-total');

    li.addEventListener('click', () => filtrarPorCategoria(0));

    const titulo = document.createElement('h2');
    titulo.innerText = "Total";
    titulo.classList.add('total-title');
    li.appendChild(titulo);

    const total = document.createElement('p');
    total.classList.add('subtitle');
    total.innerText = filtraTotal()
    li.appendChild(total);

    lista.appendChild(li);

    categorias.forEach(elemento => {
      const totalCategoria = obterTotal(elemento.id);
      const li = document.createElement('li');
      li.classList.add('list-item', 'list-item-total');
  
      li.addEventListener('click', () => filtrarPorCategoria(elemento.id));
  
      const titulo = document.createElement('h2');
      titulo.innerText = elemento.nome;
      titulo.classList.add('total-title');
      li.appendChild(titulo);
  
      const total = document.createElement('p');
      total.innerText = totalCategoria;
      total.classList.add('subtitle');
      li.appendChild(total);
  
      lista.appendChild(li);
    });
}

function addCards(evento) {
    evento.preventDefault();
    if (editando) {
        const novoCard = {
            id: idCardEdit,
            titulo: evento.target.form_titulo.value,
            skill: evento.target.form_skill.value,
            categoria: parseInt(evento.target.category.value),
            descricao: evento.target.description.value,
            video: evento.target.form_youtube.value,
        }
        updateCard(novoCard);
        formulario.querySelector('button[type="submit"]').textContent = "Enviar";
        console.log(cards);
        editando = false;
        loadData();
    } else {
        const card = {
            id: cards.length+1,
            titulo: evento.target.form_titulo.value,
            skill: evento.target.form_skill.value,
            categoria: parseInt(evento.target.category.value),
            descricao: evento.target.description.value,
            video: evento.target.form_youtube.value,
        };
        cards.push(card);
        filtraId();
        console.log(cards);
        saveToLocalStorage(cards);
        renderCards(cards);
        renderTotal();
        swal({
            title: "SUCESSO!",
            text: "Card cadastrada na base do conhecimento",
            icon: "success",
            button: true,
        });
    }
    evento.target.reset();
        
}

const saveToLocalStorage = (arrayCards) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arrayCards))
}

const getCardsFromLocalStorage = () => {
    const cardsLS = localStorage.getItem(STORAGE_KEY)

    return cardsLS ? JSON.parse(cardsLS) : [];
}


function filtrarPorCategoria(id) {
    if (id == 0) loadData()
    else {
        const listaFiltrada = filtrarCards(id);
        renderCards(listaFiltrada);
    }
}

const filtrarCards = (id) => {
      const cardsFiltradas = cards.filter((card) => card.categoria === id);
      return cardsFiltradas;
};
  
function updateCard(newCard){
    // const divIcone = document.getElementById('div-icone');
    // const linha = divIcone.parentElement;
    const indexCard = cards.findIndex((e) => {
        console.log(e.id, newCard.id);
        return e.id == newCard.id;
    })
    cards[indexCard] = newCard;
}

function removeElementoArray(id){
    const indexDel = cards.findIndex((e) => {
        return e.id == id;
    })
    cards.splice(indexDel, 1);
}


function filtraTotal(){
    let arrayTotal = []
    cards.forEach((card) => {
        arrayTotal.push(card.categoria)
    })
    return arrayTotal.length;
}

function filtraId() {
    const filter = cards.filter((card) => card.id)
    return filter
}

function getCategoryName(id) {
    const category = categorias.find((categoria) => categoria.id === id);
    return category.nome
}

function getCategoryID(documento){
    if (documento == "Categoria: FrontEnd"){
        return 1;
    } else if (documento == "Categoria: BackEnd"){
        return 2
    } else if (documento == "Categoria: FullStack"){
        return 3
    } else if (documento == "Categoria: SoftSkill"){
        return 4
    }
}

function obterTotal(id) {
    const cardsFiltradas = filtrarCards(id);
    return cardsFiltradas.length;
}

function loadData() {
    renderCategory();
    renderTotal();
    renderCards(cards);
}


function filtraTitulo(e){
    e.preventDefault();
    const nomeBusca = e.target.busca_titulo.value
    const cardFiltrados = cards.filter((card) => 
        card.titulo.toLowerCase().includes(nomeBusca.toLowerCase())
    );
    renderCards(cardFiltrados);
    e.target.reset()
}


window.addEventListener('load', loadData);


const formulario = document.getElementById('form-cadastro');
formulario.addEventListener('submit', addCards);

const busca_titulo = document.getElementById('form-busca');
busca_titulo.addEventListener('submit', filtraTitulo);


const busca_limpar = document.getElementById('busca_limpar');
busca_limpar.addEventListener('click', loadData);

