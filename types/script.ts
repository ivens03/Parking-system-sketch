interface Vehicle {
    model: string;
    plate: string | number;
    arrival: Date | string;
}

(function(){
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

    function calcTime(mil: number){
        const min = Math.floor(mil/60000);
        const sec = Math.floor((mil/60000)/1000)

        return `${min}m e ${sec}s`;
    }

    function parking() {
     function inf () : Vehicle[] {
            return localStorage.parking ? JSON.parse(localStorage.parking) : [];
        }

        function save (vehicle: Vehicle[]){
            localStorage.setItem("parking", JSON.stringify(vehicle));
        }

        function add (vehicle: Vehicle, saving?: boolean){
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${vehicle.model}</td>
                <td>${vehicle.plate}</td>
                <td>${vehicle.arrival}</td>
                <td>
                <button class="delete" data-plate="${vehicle.plate}" >X</button>
                </td>
            `;

            row.querySelector(".delete")?.addEventListener("click", function(){
                remove(this.dataset.plate)
            })

            $("#parking")?.appendChild(row); /* Descobrir o motivo do # */ 

            if(saving) save([...inf(), vehicle]);
        }

        function remove (plate: string){

            const {arrival, model} = inf().find(vehicle => vehicle.plate === plate);

            const time = calcTime(new Date().getTime() - new Date(arrival).getTime());

            if(!confirm(`Your Vehicle ${model} entered ${arrival}. you want to leave?`)) return;

            save(inf().filter(vehicle => vehicle.plate !== plate))
            load();
        }

        function load (){
            $("#parking")!.innerHTML = "";
            const parking = inf();

            if(parking.length) {
                parking.forEach((vehicle) => add(vehicle));
            }
        }

        return { add, remove, save, load }
    }

    parking().load();
    $("#register")?.addEventListener("click", () =>{
        const model = $("#model")?.value;
        const plate = $("#plate")?.value;
    
        if (!model || !plate) {
            alert("Fill in the fields");
            return;
        }

        parking().add({ model, plate, arrival: new Date().toISOString()}, true);
    })
})()