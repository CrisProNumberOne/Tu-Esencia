"use strict";

(function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#menu-principal");
  if (!toggle || !nav) return;

  const desktopQuery = window.matchMedia("(min-width: 801px)");

  function setMenu(open) {
    nav.classList.toggle("nav--open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }

  toggle.addEventListener("click", () => {
    setMenu(!nav.classList.contains("nav--open"));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("nav--open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });
})();

(function initFaq() {
  const rows = document.querySelectorAll(".faq-row");
  if (!rows.length) return;

  function setRow(row, open) {
    row.classList.toggle("faq-row--open", open);
    row.querySelector("button").setAttribute("aria-expanded", String(open));
  }

  rows.forEach((row) => {
    row.querySelector("button").addEventListener("click", () => {
      const willOpen = !row.classList.contains("faq-row--open");
      rows.forEach((other) => setRow(other, false));
      setRow(row, willOpen);
    });
  });
})();

(function initContactForm() {
  const form = document.querySelector("#form-cotizacion");
  if (!form) return;

  const WHATSAPP_NUMBER = "527732275484";
  const EMAIL = "TuEsenciaTe@gmail.com";
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const status = form.querySelector(".form-status");
  const f = form.elements;

  form.noValidate = true;

  document.querySelectorAll("[data-servicio]").forEach((link) => {
    link.addEventListener("click", () => {
      f.servicio.value = link.dataset.servicio;
    });
  });

  function setError(field, message) {
    field.setAttribute("aria-invalid", message ? "true" : "false");
    const error = document.getElementById(field.id + "-error");
    if (error) error.textContent = message;
  }

  function validate() {
    let firstInvalid = null;

    function check(field, message) {
      setError(field, message);
      if (message && !firstInvalid) firstInvalid = field;
    }

    check(f.nombre, f.nombre.value.trim().length < 2 ? "Escribe tu nombre." : "");

    const contact = f.contacto.value.trim();
    const digits = contact.replace(/\D/g, "");
    const validPhone = !contact.includes("@") && digits.length >= 10 && digits.length <= 13;
    check(
      f.contacto,
      EMAIL_PATTERN.test(contact) || validPhone
        ? ""
        : "Escribe un correo válido o un número de 10 dígitos."
    );

    check(f.servicio, f.servicio.value ? "" : "Elige el servicio que te interesa.");
    check(
      f.mensaje,
      f.mensaje.value.trim().length < 10 ? "Cuéntanos un poco más (mínimo 10 caracteres)." : ""
    );
    check(f.privacidad, f.privacidad.checked ? "" : "Acepta el aviso de privacidad para continuar.");

    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  function showStatus(text, type) {
    status.textContent = text;
    status.className = "form-status form-status--" + type;
  }

  function buildMessage() {
    return [
      "Hola, soy " + f.nombre.value.trim() + ". Quiero una cotización gratis.",
      "Servicio: " + f.servicio.value,
      "Lo que me hace único / mi proyecto: " + f.mensaje.value.trim(),
      "Mi contacto: " + f.contacto.value.trim(),
    ].join("\n");
  }

  form.addEventListener("input", (event) => {
    if (event.target.getAttribute("aria-invalid") === "true") setError(event.target, "");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validate()) {
      showStatus("Revisa los campos marcados en rojo para continuar.", "error");
      return;
    }

    const message = buildMessage();
    const byEmail = event.submitter && event.submitter.dataset.canal === "correo";

    if (byEmail) {
      const subject = "Cotización: " + f.servicio.value;
      window.location.href =
        "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(message);
      showStatus(
        "Se abrió tu app de correo con el mensaje listo. Tu solicitud se envía hasta que pulses «Enviar» ahí. Si no se abrió, escríbenos a " + EMAIL + ".",
        "ok"
      );
    } else {
      window.open(
        "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message),
        "_blank",
        "noopener"
      );
      showStatus(
        "Se abrió WhatsApp con tu mensaje listo. Tu solicitud se envía hasta que pulses «Enviar» ahí. Si no se abrió, escríbenos al +52 773 227 5484.",
        "ok"
      );
    }
  });
})();