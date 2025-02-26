document.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.getElementById("dropArea");
    const fileInput = document.getElementById("fileInput");

    // Impede o comportamento padrão ao arrastar arquivos sobre a página
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    // Adiciona efeito visual ao entrar na área
    ["dragenter", "dragover"].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.add("highlight");
        });
    });

    // Remove o efeito visual ao sair
    ["dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.remove("highlight");
        });
    });

    // Manipula os arquivos soltos na área de drop
    dropArea.addEventListener("drop", (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            fileInput.dispatchEvent(new Event("change")); // Simula clique no input
        }
    });

    // Permite clicar na área para abrir o seletor de arquivos
    dropArea.addEventListener("click", () => {
        fileInput.click();
    });
});
