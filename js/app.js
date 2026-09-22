// PRODUCTS comes from js/products.js

function header(){
  return `<header class="site-header"><div class="container nav">
    <a class="brand" href="index.html"><span class="brand-mark">🇮🇳</span><span class="brand-text"><span>BRIDGING INDIA</span><strong>INDIA UNBOXED</strong></span></a>
    <nav class="nav-links">
      <a href="products.html">Shop</a><a href="regions.html">Regions</a><a href="gifts.html">Gift Boxes</a><a href="stories.html">Stories</a><a href="about.html">About</a>
      <a class="cart-btn" href="cart.html">🛒 Cart <span class="cart-count" id="cart-count">0</span></a>
    </nav>
    <button class="menu-btn" onclick="toggleMobileNav()">☰</button>
  </div><div id="mobile-nav" class="mobile-nav"><a href="products.html">Shop</a><a href="regions.html">Regions</a><a href="gifts.html">Gift Boxes</a><a href="stories.html">Stories</a><a href="about.html">About</a><a href="cart.html">Cart</a></div></header>`;
}
function footer(){
 return `<footer class="site-footer"><div class="container"><div class="footer-grid">
   <div><div class="brand footer-brand"><span class="brand-mark">🇮🇳</span><span class="brand-text"><span>BRIDGING INDIA</span><strong>INDIA UNBOXED</strong></span></div><p>Discover authentic flavours from every corner of India — all in one place.</p></div>
   <div class="footer-col"><h4>Explore</h4><a href="products.html">Shop</a><a href="regions.html">Regions</a><a href="gifts.html">Gift Boxes</a></div>
   <div class="footer-col"><h4>Discover</h4><a href="stories.html">Stories</a><a href="about.html">Our Story</a><a href="contact.html">Contact</a></div>
   <div class="footer-col"><h4>Coming soon</h4><a href="#">Subscriptions</a><a href="#">Loyalty</a><a href="#">Multilingual shopping</a></div>
 </div><div class="footer-bottom">© 2026 India Unboxed · Prototype website for academic/business-plan demonstration</div></div></footer>`;
}

function getCart(){return JSON.parse(localStorage.getItem("indiaUnboxedCart")||"[]")}
function saveCart(cart){localStorage.setItem("indiaUnboxedCart",JSON.stringify(cart));updateCartCount()}
function updateCartCount(){const el=document.getElementById("cart-count");if(el)el.textContent=getCart().reduce((s,i)=>s+i.qty,0)}
function showToast(msg){const old=document.querySelector(".toast");if(old)old.remove();const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}
function addToCart(id){const p=PRODUCTS.find(x=>x.id===id);const cart=getCart();const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({...p,qty:1});saveCart(cart);showToast(`${p.name} added to your box 🛍️`)}
function addGift(name,price){const cart=getCart();const key="gift-"+name.replace(/\W/g,"");const item=cart.find(x=>x.id===key);if(item)item.qty++;else cart.push({id:key,name,price:Number(price),qty:1,emoji:"🎁"});saveCart(cart);showToast(`${name} added to your box 🎁`)}

function productCard(p){
 return `<article class="product-card"><div class="product-image ${p.cls||"one"}"><span class="product-badge">${p.region}</span><span>${p.emoji}</span></div><div class="product-info"><small>${p.category}</small><h3>${p.name}</h3><p>${p.desc}</p><div class="price">₹${p.price}</div><button class="btn btn-primary" onclick="addToCart(${typeof p.id==="number"?p.id:0})">Add to cart</button></div></article>`;
}
function renderProducts(list,target){const el=document.getElementById(target);if(!el)return;el.innerHTML=list.map(productCard).join("")||"";const empty=document.getElementById("empty-products");if(empty)empty.classList.toggle("hidden",list.length>0)}

function initShop(){
 const target=document.getElementById("all-products");if(!target)return;
 const params=new URLSearchParams(location.search);
 const search=document.getElementById("product-search"), cat=document.getElementById("category-filter"), reg=document.getElementById("region-filter");
 if(params.get("category"))cat.value=params.get("category");
 if(params.get("region"))reg.value=params.get("region");
 function filter(){const q=(search.value||"").toLowerCase();const c=cat.value,r=reg.value;renderProducts(PRODUCTS.filter(p=>(c==="all"||p.category===c)&&(r==="all"||p.region===r)&&(!q||`${p.name} ${p.category} ${p.region} ${p.desc}`.toLowerCase().includes(q))),"all-products")}
 [search,cat,reg].forEach(x=>x.addEventListener("input",filter));filter();
}
function initFeatured(){renderProducts(PRODUCTS.slice(0,4),"featured-products")}

function renderCart(){
 const el=document.getElementById("cart-items");if(!el)return;const cart=getCart();
 if(!cart.length){el.innerHTML=`<div class="empty-state"><div style="font-size:70px">🛒</div><h2>Your box is empty.</h2><p>Start discovering regional flavours.</p><a class="btn btn-primary" href="products.html">Explore products</a></div>`;document.getElementById("cart-subtotal").textContent="₹0";document.getElementById("cart-total").textContent="₹0";return}
 el.innerHTML=cart.map((i,idx)=>`<div class="cart-row"><div class="cart-thumb">${i.emoji||"🎁"}</div><div><b>${i.name}</b><div>₹${i.price} each</div></div><div class="qty-controls"><button onclick="changeQty(${idx},-1)">−</button><b>${i.qty}</b><button onclick="changeQty(${idx},1)">+</button></div><button class="remove-btn" onclick="removeCart(${idx})">Remove</button></div>`).join("");
 const total=cart.reduce((s,i)=>s+i.price*i.qty,0);document.getElementById("cart-subtotal").textContent=`₹${total.toLocaleString("en-IN")}`;document.getElementById("cart-total").textContent=`₹${total.toLocaleString("en-IN")}`;
}
function changeQty(idx,d){const c=getCart();c[idx].qty+=d;if(c[idx].qty<=0)c.splice(idx,1);saveCart(c);renderCart()}
function removeCart(idx){const c=getCart();c.splice(idx,1);saveCart(c);renderCart()}
function checkoutDemo(){if(!getCart().length)return showToast("Your box is empty.");showToast("Demo checkout — connect WooCommerce/payment gateway here.")}
function toggleMobileNav(){const n=document.getElementById("mobile-nav");n.style.display=n.style.display==="grid"?"none":"grid"}
function handleContact(e){e.preventDefault();showToast("Thanks! Demo enquiry captured.");e.target.reset()}

document.addEventListener("DOMContentLoaded",()=>{
 document.getElementById("site-header").innerHTML=header();
 document.getElementById("site-footer").innerHTML=footer();
 updateCartCount();initShop();initFeatured();renderCart();
 document.querySelectorAll(".add-gift").forEach(b=>b.addEventListener("click",()=>addGift(b.dataset.name,b.dataset.price)));
});
