class Produto {
  constructor(id, nome, preco, categoria, descricao, img) {
    this.id = id; this.nome = nome; this.preco = preco;
    this.categoria = categoria; this.descricao = descricao; this.img = img;
  }
}
class Carrinho {
  constructor(){ this.itens = JSON.parse(localStorage.getItem('pi_cart_v1')||'[]'); }
  salvar(){ localStorage.setItem('pi_cart_v1', JSON.stringify(this.itens)); }
  adicionar(p){ let it=this.itens.find(i=>i.id===p.id); if(it){it.qtd++} else this.itens.push({...p,qtd:1}); this.salvar(); }
  remover(id){ this.itens=this.itens.filter(i=>i.id!==id); this.salvar(); }
  atualizarQtd(id,q){ let it=this.itens.find(i=>i.id===id); if(it){ it.qtd=q; if(it.qtd<=0) this.remover(id);} this.salvar(); }
  total(){ return this.itens.reduce((s,i)=>s+i.preco*i.qtd,0); }
}

//POO//
const produtos = [
  new Produto(1,'Camiseta Tommy',159.9,'camiseta','Camiseta confortável verde','imagens/Camiseta tommy verde.JPG'),
  new Produto(2,'camiseta Tommy',159.9,'camiseta','Camiseta tommy rosa','imagens/camiseta43.jpg'),
  new Produto(3,'Tommy Azul',159.9,'camiseta','Camiseta Tommy Hilfiger Azul','imagens/camiseta47.jpg'),
  new Produto(4,'Tommy Preta',159.90,'camiseta','Camiseta Tommy Preta','imagens/camiseta44.jpg'),
  new Produto(5,'Tommy Vinho',159.9,'camiseta','Camiseta Tommy Vinho','imagens/camiseta46.jpg'),
  new Produto(6,'Boss',99.9,'camiseta','Camiseta Boss','imagens/camiseta22.jpg'),
  new Produto(7,'Boss',99.9,'camiseta','Camiseta Boss','imagens/camiseta21.jpg'),
  new Produto(8,'Boss',99.9,'camiseta','Camiseta Boss', 'imagens/camiseta23.jpg'),
  new Produto(9,'Boss',99.9,'camiseta','Camiseta Boss','imagens/camiseta24.jpg'),
  new Produto(10,'Boss',99.9,'camiseta','Camiseta Boss','imagens/camiseta25.jpg'),
  new Produto(11,'Lacoste Azul',139.90,'camiseta','Lacoste Importada','imagens/camiseta09.jpg','imagens/camiseta19.jpg'),
  new Produto(12,'Lacoste preta ',139.90,'camiseta','Lacoste Importada','imagens/camiseta10.jpg'),
  new Produto(13,'Lacoste Vermelha ',139.90,'camiseta','Lacoste Importada','imagens/camiseta11.jpg'),
  new Produto(14,'Lacoste Branca ',139.90,'camiseta','Lacoste Importada','imagens/camiseta13.jpg'),
];

const catalogEl = document.getElementById('catalogo');
const cartBtn = document.getElementById('open-cart');
const cartPanel = document.getElementById('cartPanel');
const cartList = document.getElementById('cartList');
const subtotalEl = document.getElementById('subtotal');
const cartCountEl = document.getElementById('cartCount');
const cartLabel = document.getElementById('cartLabel');
const freteSmall = document.getElementById('freteSmall');
const btnClear = document.getElementById('btnClear');
const btnCheckout = document.getElementById('btnCheckout');
const checkoutSection = document.getElementById('checkout');
const checkoutForm = document.getElementById('checkoutForm');
const cepInput = document.getElementById('cep');
const cepNotice = document.getElementById('cepNotice');
const rua = document.getElementById('rua');
const bairro = document.getElementById('bairro');
const cidade = document.getElementById('cidade');
const uf = document.getElementById('uf');
const numero = document.getElementById('numero');
const nomeInput = document.getElementById('nome');
const subtotal2 = document.getElementById('subtotal2');
const freteLabel = document.getElementById('freteLabel');
const grandTotal = document.getElementById('grandTotal');
const orderPreview = document.getElementById('orderPreview');

const searchInput = document.getElementById('search');
const sideSearch = document.getElementById('sideSearch');
const catBtns = Array.from(document.querySelectorAll('.cat'));
const sidebarCats = Array.from(document.querySelectorAll('.sidebar-cats li'));
const catMenuBtns = Array.from(document.querySelectorAll('.cat-btn'));

const hero = document.getElementById('carousel');
const heroThumbs = document.getElementById('heroThumbs');

const cart = new Carrinho();
let filtro = 'all';
let termo = '';

function renderCatalogo(){
  const list = produtos.filter(p => (filtro==='all' || p.categoria===filtro)
    && (p.nome.toLowerCase().includes(termo) || p.descricao.toLowerCase().includes(termo)));
  catalogEl.innerHTML = list.map(p => `
    <article class="product" data-id="${p.id}">
      <img src="${p.img}" alt="${p.nome}">
      <h4>${p.nome}</h4>
      <p class="small">${p.categoria}</p>
      <div class="meta">
        <div class="price">R$ ${p.preco.toFixed(2)}</div>
        <div>
          <button class="btn" data-id="${p.id}" onclick="openDetail(${p.id})">Detalhes</button>
          <button class="btn" onclick="addToCart(${p.id})">Adicionar</button>
        </div>
      </div>
    </article>
  `).join('') || '<p>Nenhum produto encontrado</p>';
}

window.openDetail = function(id){
  const p = produtos.find(x=>x.id===id);
 
  const info = `${p.nome}\nR$ ${p.preco.toFixed(2)}\n\n${p.descricao}`;
  if(confirm(info + '\n\nAdicionar ao carrinho?')){
    cart.adicionar(p); renderCart(); announce('Produto adicionado');
  }
}
function addToCart(id){
  const p = produtos.find(x=>x.id===id);
  cart.adicionar(p);
  renderCart();
  openCart();
}
function renderCart(){
  cartList.innerHTML = '';
  if(cart.itens.length === 0){ cartList.innerHTML = '<p class="small">Carrinho vazio</p>'; }
  cart.itens.forEach(i=>{
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${i.img}" alt="${i.nome}">
      <div style="flex:1">
        <div><strong>${i.nome}</strong></div>
        <div class="small">R$ ${i.preco.toFixed(2)} x ${i.qtd}</div>
      </div>
      <div style="text-align:right">
        <div>R$ ${(i.preco*i.qtd).toFixed(2)}</div>
        <div style="margin-top:6px">
          <button onclick="decrease(${i.id})" class="btn">-</button>
          <button onclick="increase(${i.id})" class="btn">+</button>
        </div>
      </div>
    `;
    cartList.appendChild(div);
  });
  const subtotal = cart.total();
  subtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
  cartCountEl.textContent = cart.itens.length;
  updateFreteLabel();
}
window.decrease = function(id){ const it = cart.itens.find(i=>i.id===id); if(it) cart.atualizarQtd(id, it.qtd-1); renderCart(); }
window.increase = function(id){ const it = cart.itens.find(i=>i.id===id); if(it) cart.atualizarQtd(id, it.qtd+1); renderCart(); }

function updateFreteLabel(){
  const s = cart.total();
  if(s >= 300){ cartLabel.textContent = 'Você ganhou frete grátis!'; freteSmall.textContent = 'Frete grátis'; }
  else { const falta = (300 - s).toFixed(2); cartLabel.textContent = `Faltam R$ ${falta} para frete grátis`; freteSmall.textContent = 'Frete: R$ 20.00'; }
}

cartBtn.addEventListener('click', ()=>{
  const open = cartPanel.classList.toggle('open');
  cartPanel.setAttribute('aria-hidden', String(!open));
  cartBtn.setAttribute('aria-expanded', String(open));
  renderCart();
});
document.getElementById('closeCart').addEventListener('click', ()=>{ cartPanel.classList.remove('open'); });

btnClear.addEventListener('click', ()=>{ cart.itens = []; cart.salvar(); renderCart(); });
btnCheckout.addEventListener('click', ()=>{ cartPanel.classList.remove('open'); showCheckout(); });


function showCheckout(){
  checkoutSection.hidden = false;
  document.getElementById('catalogo').scrollIntoView({behavior:'smooth'});
   
  subtotal2.textContent = `R$ ${cart.total().toFixed(2)}`;
  calculateFreteAndTotals();
  renderOrderPreview();
}

function calculateFreteAndTotals(){
  const s = cart.total();
  const frete = s >= 300 ? 0 : 20;
  freteLabel.textContent = frete === 0 ? 'Frete grátis!' : `Frete: R$ ${frete.toFixed(2)}`;
  grandTotal.textContent = `R$ ${(s + frete).toFixed(2)}`;
  subtotal2.textContent = `R$ ${s.toFixed(2)}`;
}

checkoutForm && checkoutForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  
  if(cart.itens.length === 0){ alert('Carrinho vazio.'); return; }
  alert('Pedido confirmado! Obrigado pela compra.'); cart.itens = []; cart.salvar(); renderCart(); location.reload();
});
document.getElementById('cancelCheckout').addEventListener('click', ()=>{ checkoutSection.hidden = true; });


cepInput && cepInput.addEventListener('input', handleCepInput);
let cepTimer = null;
function handleCepInput(e){
  const val = e.target.value.replace(/\D/g,'');
  if(val.length !== 8) return;
  if(cepTimer) clearTimeout(cepTimer);
  cepTimer = setTimeout(()=> fetchCep(val), 300);
}
//api de cep//
async function fetchCep(cep){
  cepNotice.textContent = 'Buscando...';
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if(!res.ok) throw new Error('Erro rede');
    const data = await res.json();
    if(data.erro){ cepNotice.textContent = 'CEP não encontrado. Preencha manualmente.'; return; }
    rua.value = data.logradouro || ''; bairro.value = data.bairro || ''; cidade.value = data.localidade || ''; uf.value = data.uf || '';
    numero.focus();
    cepNotice.textContent = 'Endereço preenchido. Foque no número.';
    calculateFreteAndTotals();
  } catch(err){
    cepNotice.textContent = 'Falha ao consultar CEP. Preencha manualmente.';
  }
}

searchInput && document.getElementById('btnSearch').addEventListener('click', ()=>{ termo = searchInput.value.trim().toLowerCase(); renderCatalogo(); });
sideSearch && sideSearch.addEventListener('input', ()=>{ termo = sideSearch.value.trim().toLowerCase(); renderCatalogo(); });

catBtns.forEach(b=> b.addEventListener('click', ()=>{ filtro = b.dataset.cat || 'all'; renderCatalogo(); }));
sidebarCats.forEach(b=> b.addEventListener('click', ()=>{ filtro = b.dataset.cat || 'all'; renderCatalogo(); }));
catMenuBtns.forEach(b=> b.addEventListener('click', ()=>{ filtro = b.dataset.cat || 'all'; renderCatalogo(); }));

function renderOrderPreview(){
  if(!orderPreview) return;
  if(cart.itens.length===0){ orderPreview.innerHTML = '<p>Carrinho vazio</p>'; return; }
  orderPreview.innerHTML = cart.itens.map(i => `<div>${i.nome} x ${i.qtd} — R$ ${(i.preco*i.qtd).toFixed(2)}</div>`).join('') +
    `<hr><div><strong>Subtotal:</strong> R$ ${cart.total().toFixed(2)}</div>`;
}

(function initCarousel(){
  const slides = Array.from(document.querySelectorAll('.carousel .slide'));
  let idx = 0;
  function show(i){
    slides.forEach((s,si)=> s.classList.toggle('active', si===i));
    document.querySelectorAll('.hero-thumbs .thumb').forEach((t,ti)=> t.classList.toggle('active', ti===i));
  }
  show(0);
  setInterval(()=>{ idx = (idx+1)%slides.length; show(idx); }, 4500);
  // thumbs
  document.querySelectorAll('.hero-thumbs .thumb').forEach(btn => btn.addEventListener('click', ()=>{ const i = +btn.dataset.index; idx = i; show(i); }));
})();


function openCart(){ cartPanel.classList.add('open'); renderCart(); }
function announce(msg){  console.log(msg); }


renderCatalogo();
renderCart();
calculateFreteAndTotals();
renderOrderPreview();
