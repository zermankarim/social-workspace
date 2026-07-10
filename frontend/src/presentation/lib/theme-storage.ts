export const THEME_STORAGE_KEY = "social-theme";

export const themeInitScript = `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");if(!s)return;var p=JSON.parse(s);if(p.state&&p.state.theme==="dark")document.documentElement.classList.add("dark")}catch(e){}})();`;
