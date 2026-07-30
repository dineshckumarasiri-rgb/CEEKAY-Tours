document.addEventListener("DOMContentLoaded", function () {

    // PASSENGER GENERATOR
    document.getElementById("passengers").addEventListener("change", function () {

        let count = parseInt(this.value);
        let container = document.getElementById("passengerDetails");
        container.innerHTML = "";

        if (!count || count < 1) return;

        for (let i = 1; i <= count; i++) {

            let box = document.createElement("div");
            box.style.marginBottom = "15px";

            box.innerHTML = `
                <h4>Passenger ${i}</h4>

                <label>Age</label>
                <input type="number" min="0" class="age" required>

                <label>Gender</label>
                <select class="gender" required>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                </select>
            `;

            container.appendChild(box);
        }
    });


    // DAY GENERATOR
    document.getElementById("createPlanBtn").addEventListener("click", function () {

        let days = parseInt(document.getElementById("totalDays").value);
        let container = document.getElementById("daysContainer");
        let summary = document.getElementById("itinerarySummary");

        container.innerHTML = "";
        summary.innerHTML = "";

        if (!days || days < 1) return;

        for (let i = 1; i <= days; i++) {

            let dayBox = document.createElement("div");
            dayBox.style.marginBottom = "20px";

            dayBox.innerHTML = `
                <h4>Day ${String(i).padStart(2,'0')}</h4>
                <input type="text"
                       id="day${i}"
                       placeholder="Example: Sigiriya, Dambulla"
                       style="width:100%;">
            `;

            container.appendChild(dayBox);
        }
    });


    // UPDATE SUMMARY LIVE
    document.addEventListener("input", function () {

        let days = parseInt(document.getElementById("totalDays").value);
        let summaryText = "";

        for (let i = 1; i <= days; i++) {

            let input = document.getElementById(`day${i}`);
            if (input && input.value.trim() !== "") {
                summaryText += `Day ${String(i).padStart(2,'0')} – ${input.value}\n`;
            }
        }

        document.getElementById("itinerarySummary").innerHTML =
            summaryText.replace(/\n/g, "<br>");
    });

});


// ===== GLOBAL FUNCTIONS (OUTSIDE DOMContentLoaded) =====

function collectFormData() {

    let travelDate = document.getElementById("travelDate").value;
    let passengers = document.getElementById("passengers").value;
    let specialRequest = document.getElementById("specialRequest").value;
    let name = document.getElementById("customerName").value;
    let email = document.getElementById("customerEmail").value;
    let whatsapp = document.getElementById("customerWhatsapp").value;

    let passengerDetails = "";
    let ages = document.querySelectorAll(".age");
    let genders = document.querySelectorAll(".gender");

    for (let i = 0; i < ages.length; i++) {
        passengerDetails += `Passenger ${i+1}: Age ${ages[i].value}, ${genders[i].value}\n`;
    }

    let days = parseInt(document.getElementById("totalDays").value);
    let itinerary = "";

    for (let i = 1; i <= days; i++) {
        let input = document.getElementById(`day${i}`);
        if (input && input.value.trim() !== "") {
            itinerary += `Day ${String(i).padStart(2,'0')} – ${input.value}\n`;
        }
    }

    return {
        travelDate,
        passengers,
        passengerDetails,
        itinerary,
        specialRequest,
        name,
        email,
        whatsapp
    };
}


function sendWhatsApp() {

    let data = collectFormData();

    let message =
`Hello CEEKAY Tours,

Travel Date: ${data.travelDate}
Passengers: ${data.passengers}

Passenger Details:
${data.passengerDetails}

Planned Itinerary:
${data.itinerary}

Special Requests:
${data.specialRequest}

Contact:
Name: ${data.name}
Email: ${data.email}
WhatsApp: ${data.whatsapp}
`;

    let encoded = encodeURIComponent(message);

    window.open(`https://wa.me/94776600560?text=${encoded}`, "_blank");
}


function sendEmail() {

    let data = collectFormData();

    let subject = encodeURIComponent("New Travel Inquiry - CEEKAY Tours");

    let body =
`Travel Date: ${data.travelDate}
Passengers: ${data.passengers}

Passenger Details:
${data.passengerDetails}

Planned Itinerary:
${data.itinerary}

Special Requests:
${data.specialRequest}

Contact:
Name: ${data.name}
Email: ${data.email}
WhatsApp: ${data.whatsapp}
`;

    let encodedBody = encodeURIComponent(body);

    window.location.href =
        `mailto:ceekaytours@gmail.com?subject=${subject}&body=${encodedBody}`;
}
