(async () => {
    const dbName = "cstimer";
    const objectStoreName = "sessions";
    let lastDataHash = null;
    let canvas;
    let currentSession;
    let previousSessionValue;

    function getCurrentSession() {
        const myData = JSON.parse(localStorage.getItem("properties"));
        const sessionNum = myData?.session || 1;
        return `session_${String(sessionNum).padStart(2, "0")}_00`;
    }

    function createOrUpdateChart(times) {
        const currentDataHash = JSON.stringify(times);
        if (currentDataHash === lastDataHash) return;

        lastDataHash = currentDataHash;

        if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.id = "chartCanvas";
            canvas.style.cssText = `
                background-color: transparent;
                width: 100%;
                position: absolute;
                bottom: 0;
                margin-left: 13.5rem;
                z-index: 1000;
                height: 12rem;
            `;

            document.body.appendChild(canvas);
            document.getElementById("stats").style.width = "12.5rem";
            const ctx = canvas.getContext("2d");
            window.chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: "Times (seconds)",
                            borderColor: "rgba(75, 192, 192, 1)",
                            backgroundColor: "rgb(255, 255, 255)",
                            borderWidth: 2,
                            data: [],
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                color: "#ffffff",
                                font: { size: 16 },
                                text: "Attempt Number",
                            },
                            ticks: { color: "grey" },
                            grid: { color: "black" },
                        },
                        y: {
                            title: {
                                display: true,
                                color: "#ffffff",
                                font: { size: 16 },
                                text: "Time (sec)",
                            },
                            ticks: { color: "grey" },
                            grid: { color: "black" },
                        },
                    },
                },
            });
        }

        window.chart.data.datasets[0].data = times;
        window.chart.data.labels = times.map((_, index) => index + 1);
        window.chart.update();
    }

    async function fetchDataFromDatabase() {
        const db = await new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });

        const transaction = db.transaction([objectStoreName], "readonly");
        const objectStore = transaction.objectStore(objectStoreName);
        const sessionKey = getCurrentSession();

        try {
            const result = await new Promise((resolve, reject) => {
                const request = objectStore.get(sessionKey);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result);
            });

            const times = result?.map((solve) => solve[0][1] / 1000) || [];
            createOrUpdateChart(times);
        } catch (error) {
            console.error("Error reading data from sessions:", error);
        }
    }

    // Revert back to the original visibility checking logic
    setInterval(() => {
        const scrambleDiv = document.getElementById("scrambleDiv");
        if (scrambleDiv.style.display === "none") {
            console.log("HIDDEN");
            document.getElementById("chartCanvas").style.display = "none";
        }
    }, 75);

    setInterval(() => {
        const scrambleDiv = document.getElementById("scrambleDiv");
        if (scrambleDiv.style.display === "block") {
            console.log("VISIBLE");
            document.getElementById("chartCanvas").style.display = "block";
            return;
        }
    }, 75);

    setInterval(fetchDataFromDatabase, 1000);
})();
