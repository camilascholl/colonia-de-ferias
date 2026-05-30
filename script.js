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

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxhTYEZRpXjTzFlRX6tsjdly_UXDiCl-VqpSMIM4af_rh5aSgFLeQE9zJfnTKT49RoaBA/exec';
const CHURCH_WHATSAPP_URL = 'https://wa.me/5500000000000';
const STONE_PAYMENT_URL = 'https://payment-link-v3.ton.com.br/pl_ngY1o3LRPwy8lpVInwFDBEVD9MpjWmGb';
const registrationForm = document.getElementById('registrationForm');
const formStatus = document.getElementById('formStatus');
const successModal = document.getElementById('successModal');
const successWhatsAppLink = document.getElementById('successWhatsAppLink');
const stonePaymentLink = document.getElementById('stonePaymentLink');
const registrationIdInput = document.getElementById('registrationId');
const successRegistrationId = document.getElementById('successRegistrationId');

function generateRegistrationId() {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  const randomPart = values[0].toString(36).toUpperCase().padStart(6, '0').slice(0, 6);

  return `COL-${randomPart}`;
}

function openSuccessModal(childName, registrationId) {
  if (!successModal) return;

  if (stonePaymentLink && STONE_PAYMENT_URL) {
    stonePaymentLink.href = STONE_PAYMENT_URL;
    stonePaymentLink.classList.remove('is-hidden');
  }

  if (successRegistrationId) {
    successRegistrationId.textContent = registrationId || '';
  }

  if (successWhatsAppLink) {
    const paymentText = STONE_PAYMENT_URL ? ` Link para pagamento: ${STONE_PAYMENT_URL}` : '';
    const message = childName
      ? `Olá! Acabei de enviar a inscrição de ${childName} na Colônia de Férias. Código: ${registrationId}. Quero enviar o comprovante de pagamento.${paymentText}`
      : `Olá! Acabei de enviar a inscrição da Colônia de Férias. Código: ${registrationId}. Quero enviar o comprovante de pagamento.${paymentText}`;

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
    const registrationId = generateRegistrationId();

    if (registrationIdInput) {
      registrationIdInput.value = registrationId;
    }

    formData.set('inscricao_id', registrationId);
    formData.set('link_pagamento', STONE_PAYMENT_URL);
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
      openSuccessModal(childName, registrationId);
    } catch (error) {
      formStatus.textContent = 'Não foi possível enviar agora. Tente novamente em instantes.';
      formStatus.className = 'form-status error';
    } finally {
      submitButton.disabled = false;
    }
  });
}
