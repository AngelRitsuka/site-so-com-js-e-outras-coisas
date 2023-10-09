var cal = 
{
    sMon : false, //semana começa na segunda
    data : null, 
    sDay : 0, sMth : 0, sYear : 0, 

    //Meses e nome dos dias com matriz
    months : 
    [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ],
    days : 
    ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
  
   //seleção de meses/ano
    hMth : null, hYear : null, 
    hWrap : null, //wrapper do calendário
    hFormWrap : null, hForm : null, 
    hfDate : null, hfTxt : null, hfDel : null, 
  
    
    init : () => 
    {
     
      cal.hMth = document.getElementById("calMonth");
      cal.hYear = document.getElementById("calYear");
      cal.hWrap = document.getElementById("calWrap");
      cal.hFormWrap = document.getElementById("calForm");
      cal.hForm = cal.hFormWrap.querySelector("form");
      cal.hfDate = document.getElementById("evtDate");
      cal.hfTxt = document.getElementById("evtTxt");
      cal.hfDel = document.getElementById("evtDel");
  
     //Aparecer os meses
      let now = new Date(), nowMth = now.getMonth();
      cal.hYear.value = parseInt(now.getFullYear());

      //para os 12 meses
      for (let i=0; i<12; i++) {
        let opt = document.createElement("option");
        opt.value = i;
        opt.innerHTML = cal.months[i];
        if (i==nowMth) { opt.selected = true; }
        cal.hMth.appendChild(opt);
      }
  
      //controles
      cal.hMth.onchange = cal.draw;
      cal.hYear.onchange = cal.draw;
      document.getElementById("calBack").onclick = () => cal.pshift();
      document.getElementById("calNext").onclick = () => cal.pshift(1);
      cal.hForm.onsubmit = cal.save;
      document.getElementById("evtClose").onclick = () => cal.hFormWrap.close();
      cal.hfDel.onclick = cal.del;
  
    //desenhar o calendario
      if (cal.sMon) 
      { 
        cal.days.push(cal.days.shift()); 
       }

      cal.draw();
    },
  
   //periodo shifter 1 mês
    pshift : forward => 
    {
      cal.sMth = parseInt(cal.hMth.value);
      cal.sYear = parseInt(cal.hYear.value);
      if (forward) 
      { 
        cal.sMth++; 
      }

    else 
     { 
        cal.sMth--; 
     }
      
     if (cal.sMth > 11) 
      { 
        cal.sMth = 0; cal.sYear++; 
      }
     
      if (cal.sMth < 0) 
      { 
        cal.sMth = 11; cal.sYear--; 
      }
      
      cal.hMth.value = cal.sMth;
      cal.hYear.value = cal.sYear;
      cal.draw();
    },
  
    //desenhar o calendario para cada mês
    draw : () => 
    {
     
        //dias do mês + Incio/Fim dos dias
        

        /*
            Importante:
            Janeiro é 0 e dezembro é 11
            domingo é 0 e sábado é 6
        */
        
        //seleionar o mês
        cal.sMth = parseInt(cal.hMth.value); 
        cal.sYear = parseInt(cal.hYear.value);

        //selecionar o ano
        let daysInMth = new Date(cal.sYear, cal.sMth+1, 0).getDate(), 
            startDay = new Date(cal.sYear, cal.sMth, 1).getDay(),
            endDay = new Date(cal.sYear, cal.sMth, daysInMth).getDay(), 
            now = new Date(), 
            nowMth = now.getMonth(), 
            nowYear = parseInt(now.getFullYear()), 
            nowDay = cal.sMth==nowMth && cal.sYear==nowYear ? now.getDate() : null ;
    
        //carregar a data
        cal.data = localStorage.getItem("cal-" + cal.sMth + "-" + cal.sYear);

        if (cal.data==null) 
        {
            localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, "{}");
            cal.data = {};
        } else { cal.data = JSON.parse(cal.data); }
    
        
        //desenhar os calculos
        let squares = [];
        if (cal.sMon && startDay != 1) 
        {
            let blanks = startDay==0 ? 7 : startDay ;
            for (let i=1; i<blanks; i++) 
            { 
            squares.push("b"); 
            }
        }

        if (!cal.sMon && startDay != 0) 
        {
            for (let i=0; i<startDay; i++) 
            { 
            squares.push("b"); 
            }
        }
    
        //dia do mês
        for (let i=1; i<=daysInMth; i++) 
        {
            squares.push(i); 
        }
    
        //squares vazios no final do mês
        if (cal.sMon && endDay != 0) 
        {
            let blanks = endDay==6 ? 1 : 7-endDay;
            for (let i=0; i<blanks; i++) 
            { 
            squares.push("b"); 
            }
        }

        if (!cal.sMon && endDay != 6) 
        {
            let blanks = endDay==0 ? 6 : 6-endDay;
            for (let i=0; i<blanks; i++) 
            { 
            squares.push("b"); 
            }
        }
    
        //Resetando o calendário
        cal.hWrap.innerHTML = `<div class="calHead"></div>
        <div class="calBody">
            <div class="calRow"></div>
        </div>`;
    
        //Cabeçalho do calendário
        wrap = cal.hWrap.querySelector(".calHead");
        for (let d of cal.days) 
        {
            let cell = document.createElement("div");
            cell.className = "calCell";
            cell.innerHTML = d;
            wrap.appendChild(cell);
        }
    
        //Corpo do Calendário: Dias e Eventos individuais
        wrap = cal.hWrap.querySelector(".calBody");
        row = cal.hWrap.querySelector(".calRow");
        for (let i=0; i<squares.length; i++) 
        {
        
            //gerar cell
            let cell = document.createElement("div");
            cell.className = "calCell";

            if (nowDay==squares[i]) 
            { 
             cell.classList.add("calToday"); 
            }
            if (squares[i]=="b") 
            { 
                cell.classList.add("calBlank"); 
            }
            else 
            {
                cell.innerHTML = `<div class="cellDate">${squares[i]}</div>`;
                    
                if (cal.data[squares[i]]) 
                {
                    cell.innerHTML += "<div class='evt'>" + cal.data[squares[i]] + "</div>";
                }

                cell.onclick = () => 
                { 
                    cal.show(cell); 
                };
            }
            row.appendChild(cell);
    
        
            if (i!=(squares.length-1) && i!=0 && (i+1)%7==0) 
            {
                row = document.createElement("div");
                row.className = "calRow";
                wrap.appendChild(row);
            }
        }
    },
  
                            /*
                            Um calculo da bunch de dia/mes/ano
                            Json encoded para retornar os eventos

                            todos os calculos na matriz da squares = []
                            resetar no html
                            redesenhar os dias
                            loop dos squares para desenhar no hmtl
                            */
    
        show : cell =>
        {
                cal.hForm.reset();
                cal.sDay = cell.querySelector(".cellDate").innerHTML;
                cal.hfDate.value = `${cal.sDay} ${cal.months[cal.sMth]} ${cal.sYear}`;

            if (cal.data[cal.sDay] !== undefined) 
            {
                cal.hfTxt.value = cal.data[cal.sDay];
                cal.hfDel.classList.remove("hide");
            } 
            else { 
                    cal.hfDel.classList.add("hide");
                }
            cal.hFormWrap.show();
        },
  

                     /*
                    pesquisar, comparar dois objetos
                    dmi ligado e desligado
                    */ 
   
    save : () => 
    {
      cal.data[cal.sDay] = cal.hfTxt.value;
      localStorage.setItem(`cal-${cal.sMth}-${cal.sYear}`, JSON.stringify(cal.data));
      cal.draw();
      cal.hFormWrap.close();
      return false;
    },
  
    
    del : () => 
    { 
        if (confirm("Delete event?")) 
        {
            delete cal.data[cal.sDay];
            localStorage.setItem(`cal-${cal.sMth}-${cal.sYear}`, JSON.stringify(cal.data));
            cal.draw();
            cal.hFormWrap.close();
        }
    }
  };

  window.onload = cal.init;