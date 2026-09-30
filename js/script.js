document.addEventListener("DOMContentLoaded",()=>{
  const form=document.getElementById("formAgendamento"),lista=document.getElementById("listaAgendamentos"),vazio=document.getElementById("agendaVazia"),contador=document.getElementById("contadorAgenda"),badge=document.getElementById("badgeAgendamentos"),busca=document.getElementById("campoBusca");
  let agendamentos=JSON.parse(localStorage.getItem("petvidaAgendamentos")||"[]");
  const toastEl=document.getElementById("toastPetVida"),toastMsg=document.getElementById("toastMensagem");
  function toast(msg){toastMsg.textContent=msg;bootstrap.Toast.getOrCreateInstance(toastEl,{delay:2800}).show()}
  function esc(t){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
  function dataBR(d){const [a,m,dia]=d.split("-");return `${dia}/${m}/${a}`}
  function render(){
    lista.querySelectorAll(".appointment-row").forEach(e=>e.remove());contador.textContent=agendamentos.length;badge.textContent=agendamentos.length;
    vazio.style.display=agendamentos.length?"none":"flex";
    agendamentos.slice().sort((a,b)=>`${a.data} ${a.hora}`.localeCompare(`${b.data} ${b.hora}`)).forEach(x=>{const row=document.createElement("div");row.className="appointment-row";row.innerHTML=`<div class="appointment-main"><strong>${esc(x.pet)}</strong><span>Tutor: ${esc(x.tutor)}</span></div><div class="appointment-main"><strong>${esc(x.servico)}</strong><span>Atendimento PetVida</span></div><div class="appointment-date"><strong>${dataBR(x.data)}</strong><br>${esc(x.hora)}</div><button class="btn-delete" data-id="${x.id}" title="Excluir" type="button"><i class="bi bi-trash3"></i></button>`;lista.appendChild(row)})
  }
  form.addEventListener("submit",e=>{e.preventDefault();const pet=document.getElementById("petNome").value.trim(),servico=document.getElementById("servico").value,data=document.getElementById("data").value,hora=document.getElementById("hora").value,tutor=document.getElementById("tutor").value.trim();if(!pet||!servico||!data||!hora||!tutor)return toast("Preencha todos os campos.");if(agendamentos.some(x=>x.data===data&&x.hora===hora))return toast("Já existe um atendimento para esse horário.");agendamentos.push({id:Date.now(),pet,servico,data,hora,tutor});localStorage.setItem("petvidaAgendamentos",JSON.stringify(agendamentos));render();form.reset();toast("Agendamento cadastrado com sucesso.")});
  lista.addEventListener("click",e=>{const b=e.target.closest(".btn-delete");if(!b)return;agendamentos=agendamentos.filter(x=>x.id!==Number(b.dataset.id));localStorage.setItem("petvidaAgendamentos",JSON.stringify(agendamentos));render();toast("Agendamento removido.")});
  document.querySelectorAll(".service-card").forEach(b=>b.addEventListener("click",()=>{document.getElementById("servico").value=b.dataset.servico;document.getElementById("agenda").scrollIntoView({behavior:"smooth"});document.getElementById("petNome").focus()}));
  busca.addEventListener("input",()=>{const q=busca.value.toLowerCase().trim();document.querySelectorAll(".service-item").forEach(item=>item.style.display=(`${item.dataset.search} ${item.innerText}`).toLowerCase().includes(q)?"":"none")});
  document.getElementById("btnHistorico").addEventListener("click",()=>toast("Histórico demonstrativo aberto — funcionalidade ilustrativa do protótipo."));
  document.getElementById("formLogin").addEventListener("submit",e=>{e.preventDefault();bootstrap.Modal.getOrCreateInstance(document.getElementById("loginModal")).hide();e.target.reset();toast("Login demonstrativo realizado.")});
  const inputData=document.getElementById("data");const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);inputData.min=tomorrow.toISOString().split("T")[0];render();
});
