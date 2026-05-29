const menuButton = document.getElementById('menuButton');
const navLinks = document.getElementById('navLinks');

if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

const GOOGLE_SCRIPT_URL = '';
const CHURCH_WHATSAPP_URL = 'https://wa.me/5500000000000';
const registrationForm = document.getElementById('registrationForm');
const formStatus = document.getElementById('formStatus');
const successModal = document.getElementById('successModal');
const successWhatsAppLink = document.getElementById('successWhatsAppLink');

function openSuccessModal(childName) {
  if (!successModal) return;

  if (successWhatsAppLink) {
    const message = childName
      ? `Olá! Acabei de enviar a inscrição de ${childName} na Colônia de Férias e gostaria de confirmar.`
      : 'Olá! Acabei de enviar a inscrição da Colônia de Férias e gostaria de confirmar.';

    successWhatsAppLink.href = `${CHURCH_WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
  }

  successModal.classList.add('is-open');
  successModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
  if (!successModal) return;

  successModal.classList.remove('is-open');
  successModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-close-success-modal]').forEach((element) => {
  element.addEventListener('click', closeSuccessModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeSuccessModal();
  }
});

if (registrationForm) {
  registrationForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!registrationForm.checkValidity()) {
      registrationForm.reportValidity();
      formStatus.textContent = 'Preencha todos os campos obrigatórios antes de enviar.';
      formStatus.className = 'form-status error';
      return;
    }

    if (!GOOGLE_SCRIPT_URL) {
      formStatus.textContent = 'A integração com a planilha ainda precisa ser configurada.';
      formStatus.className = 'form-status error';
      return;
    }

    const submitButton = registrationForm.querySelector('button[type="submit"]');
    const formData = new FormData(registrationForm);
    const childName = String(formData.get('nome_crianca') || '').trim();
    formData.append('enviado_em', new Date().toLocaleString('pt-BR'));

    submitButton.disabled = true;
    formStatus.textContent = 'Enviando inscrição...';
    formStatus.className = 'form-status';

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });

      registrationForm.reset();
      formStatus.textContent = '';
      formStatus.className = 'form-status';
      openSuccessModal(childName);
    } catch (error) {
      formStatus.textContent = 'Não foi possível enviar agora. Tente novamente em instantes.';
      formStatus.className = 'form-status error';
    } finally {
      submitButton.disabled = false;
    }
  });
}
