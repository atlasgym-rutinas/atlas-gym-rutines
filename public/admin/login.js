// Completa el login de Decap con lo que el CSS solo no puede: etiquetas,
// placeholders en español y el botón para ver la contraseña.
// Solo agrega elementos al formulario de Decap; no quita ni mueve nada suyo.
(() => {
  const OJO =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>' +
    '<path class="tachado" d="m4 4 16 16"/></svg>';

  const etiqueta = (texto, id) => {
    const label = document.createElement("label");
    label.className = "atlas-label";
    label.htmlFor = id;
    label.textContent = texto;
    return label;
  };

  const completar = (form) => {
    form.dataset.atlas = "listo";
    const email = form.querySelector('input[name="email"]');
    const clave = form.querySelector('input[name="password"]');
    if (!email || !clave) return;

    email.id = "atlas-email";
    email.dataset.atlasCampo = "email";
    email.placeholder = "ejemplo@correo.com";
    email.autocomplete = "email";
    email.inputMode = "email";
    email.setAttribute("autocapitalize", "none");
    email.spellcheck = false;

    clave.id = "atlas-password";
    clave.dataset.atlasCampo = "password";
    clave.placeholder = "Tu contraseña";
    clave.autocomplete = "current-password";

    // El <p> de error que Decap pone justo antes de cada campo.
    const errorEmail = email.previousElementSibling;
    const errorClave = clave.previousElementSibling;
    if (errorEmail?.tagName === "P") errorEmail.dataset.atlasError = "email";
    if (errorClave?.tagName === "P") errorClave.dataset.atlasError = "password";

    form.insertBefore(etiqueta("Correo", "atlas-email"), email);
    form.insertBefore(etiqueta("Contraseña", "atlas-password"), clave);

    const ojo = document.createElement("button");
    ojo.type = "button";
    ojo.className = "atlas-ojo";
    ojo.setAttribute("aria-label", "Mostrar contraseña");
    ojo.setAttribute("aria-pressed", "false");
    ojo.innerHTML = OJO;
    ojo.addEventListener("click", () => {
      const ver = clave.type === "password";
      clave.type = ver ? "text" : "password";
      ojo.setAttribute("aria-pressed", String(ver));
      ojo.setAttribute("aria-label", ver ? "Ocultar contraseña" : "Mostrar contraseña");
      clave.focus();
    });
    form.insertBefore(ojo, clave.nextSibling);
  };

  // Decap dibuja el login después de cargar; lo esperamos (y de nuevo si se cierra sesión).
  const buscar = () => {
    const form = document.querySelector('form[class*="-AuthForm"]:not([data-atlas])');
    if (form) completar(form);
  };
  new MutationObserver(buscar).observe(document.documentElement, { childList: true, subtree: true });
  buscar();
})();
