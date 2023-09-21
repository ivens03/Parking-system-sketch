(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTime(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil / 60000) / 1000);
        return `${min}m e ${sec}s`;
    }
    function parking() {
        function inf() {
            return localStorage.parking ? JSON.parse(localStorage.parking) : [];
        }
        function save(vehicle) {
            localStorage.setItem("parking", JSON.stringify(vehicle));
        }
        function add(vehicle, saving) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${vehicle.model}</td>
                <td>${vehicle.plate}</td>
                <td>${vehicle.arrival}</td>
                <td>
                <button class="delete" data-plate="${vehicle.plate}" >X</button>
                </td>
            `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remove(this.dataset.plate);
            });
            (_b = $("#parking")) === null || _b === void 0 ? void 0 : _b.appendChild(row); /* Descobrir o motivo do # */
            if (saving)
                save([...inf(), vehicle]);
        }
        function remove(plate) {
            const { arrival, model } = inf().find(vehicle => vehicle.plate === plate);
            const time = calcTime(new Date().getTime() - new Date(arrival).getTime());
            if (!confirm(`Your Vehicle ${model} entered ${arrival}. you want to leave?`))
                return;
            save(inf().filter(vehicle => vehicle.plate !== plate));
            load();
        }
        function load() {
            $("#parking").innerHTML = "";
            const parking = inf();
            if (parking.length) {
                parking.forEach((vehicle) => add(vehicle));
            }
        }
        return { add, remove, save, load };
    }
    parking().load();
    (_a = $("#register")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const model = (_a = $("#model")) === null || _a === void 0 ? void 0 : _a.value;
        const plate = (_b = $("#plate")) === null || _b === void 0 ? void 0 : _b.value;
        if (!model || !plate) {
            alert("Fill in the fields");
            return;
        }
        parking().add({ model, plate, arrival: new Date().toISOString() }, true);
    });
})();
