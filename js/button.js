import { app } from "../../scripts/app.js";

app.registerExtension({
    name: "otacoo.imgextract.popout_v2",
    
    async setup() {
        const btnId = "otacoo-extractor-btn";
        if (document.getElementById(btnId)) return;

        // --- 1. La fonction d'ouverture "Pop-out" ---
        const openNativeWindow = () => {
            // NOUVELLES DIMENSIONS (Grand Format)
            // On vise large pour que les 3 colonnes rentrent sans scroll
            const w = 1280; 
            const h = 900;
            
            // Calcul pour centrer parfaitement sur l'écran
            const left = (window.screen.width / 2) - (w / 2);
            const top = (window.screen.height / 2) - (h / 2);

            // Configuration de la fenêtre
            const features = [
                `width=${w}`,
                `height=${h}`,
                `top=${top}`,
                `left=${left}`,
                'resizable=yes', // Tu pourras toujours redimensionner
                'scrollbars=yes',
                'status=no',
                'menubar=no',
                'toolbar=no',
                'location=no'
            ].join(',');

            // Nom unique 'OtacooWindow' pour éviter d'ouvrir 50 fenêtres
            const win = window.open('/imgextract', 'OtacooWindow', features);

            if (win) {
                win.focus();
            }
        };

        // --- 2. Création du bouton ---
        const btn = document.createElement("button");
        btn.id = btnId;
        btn.textContent = "✨ Extractor";
        btn.title = "Ouvrir l'extracteur dans une fenêtre indépendante";
        
        Object.assign(btn.style, {
            backgroundColor: "#2e303d",
            color: "#ececec",
            border: "1px solid #6b6e7f",
            borderRadius: "4px",
            padding: "0 16px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            height: "auto",
            minHeight: "100%",
            alignSelf: "stretch",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 4px",
            whiteSpace: "nowrap",
            transition: "all 0.2s",
            zIndex: "1000"
        });

        // Effets visuels
        btn.onmouseenter = () => { btn.style.backgroundColor = "#464a5c"; };
        btn.onmouseleave = () => { btn.style.backgroundColor = "#2e303d"; };
        
        // Action
        btn.onclick = openNativeWindow;

        // --- 3. Injection Intelligente ---
        const injectButton = () => {
            const v1ButtonGroup = document.querySelector(".comfyui-button-group");
            const managerBtn = document.querySelector(".comfyui-menu-mobile-collapse");
            const classicMenu = document.querySelector(".comfy-menu");

            if (v1ButtonGroup) {
                v1ButtonGroup.prepend(btn);
                v1ButtonGroup.style.alignItems = "stretch"; 
                return true;
            } 
            else if (managerBtn && managerBtn.parentNode) {
                managerBtn.parentNode.insertBefore(btn, managerBtn);
                return true;
            }
            else if (classicMenu) {
                classicMenu.appendChild(btn);
                Object.assign(btn.style, { display: "block", width: "100%", margin: "5px 0", height: "30px" });
                return true;
            }
            return false;
        };

        let attempts = 0;
        const tryInject = setInterval(() => {
            attempts++;
            if (injectButton() || attempts > 15) {
                clearInterval(tryInject);
                if (attempts > 15 && !document.getElementById(btnId)) {
                    Object.assign(btn.style, {
                        position: "fixed", bottom: "10px", left: "10px", 
                        height: "32px", alignSelf: "auto"
                    });
                    document.body.appendChild(btn);
                }
            }
        }, 500);
    }
});