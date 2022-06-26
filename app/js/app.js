$(document).ready(function () {
  // Календарь
  if ($("#bill_date").length) {
    $.datetimepicker.setLocale("ru");

    $("#bill_date").datetimepicker({
      i18n: {
        de: {
          months: [
            "Январь",
            "Февраль",
            "Март",
            "Апрель",
            "Май",
            "Июнь",
            "Июль",
            "Август",
            "Сентябрь",
            "Октябрь",
            "Ноябрь",
            "Декабрь",
          ],
          dayOfWeek: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        },
      },
      timepicker: false,
      format: "d.m.Y",
      theme: "white",
    });
  }

  // Валидация формы
  $("#bill_form").validate({
    rules: {
      bill_number: {
        number: true,
      },
      seller_inn: {
        required: true,
        minlength: 10,
      },
    },
    messages: {
      bill_number: {
        number: "Введите число",
      },
      seller_inn: {
        required: "Введите ИНН",
        minlength: "Обязательно для заполнения, 10-12 цифр.",
      },
    },
  });

  // Добавление КПП продавца
  $(".js-add--kpp").click(function (evt) {
    evt.preventDefault();

    const kppFieldset = `
    <label for="seller_kpp" class="form-label">КПП</label>
    <input class="form-input" type="number" name="seller_kpp" id="seller_kpp" minlength="9" maxlength="9">
    `;

    const formItem = $(this).parent(".form-item");
    formItem.removeClass("form-item--add");
    formItem.html(kppFieldset);
  });

  $("select").niceSelect();

  // Открыть попап удаление строки
  $(document).on("click", ".form-remove", function (evt) {
    evt.preventDefault();

    if ($(".form-remove__popup").length) {
      $(".form-remove__popup").remove();
    }

    let type = "счета";

    if ($(this).hasClass("form-remove--bill")) {
      type = "счета";
    }

    if ($(this).hasClass("form-remove--contract")) {
      type = "контракта";
    }

    if ($(this).hasClass("form-remove--side")) {
      type = "стороны";
    }

    const formRemovePopup = `
    <div class="form-remove__popup">
      <p class="form-remove__text">Вы действительно хотите удалить пункт ${type} из списка?</p>
      <div class="form-remove__wrapper">
        <a href="#" class="form-remove__link form-remove__link--red js-remove-line">Удалить пункт</a>
        <a href="#" class="form-remove__link js-cancel-line">Отмена</a>
      </div>
    </div>
    `;
    const formItemRemove = $(this).parents(".form-item--remove");
    formItemRemove.append(formRemovePopup);
  });

  // Отменить удаление строки
  $(document).on("click", ".js-cancel-line", function (evt) {
    evt.preventDefault();

    const formRemovePopup = $(this).parents(".form-remove__popup");
    formRemovePopup.remove();
  });

  // Удалить строку
  $(document).on("click", ".js-remove-line", function (evt) {
    evt.preventDefault();

    const formLine = $(this).parents(".form-line");
    formLine.remove();
  });

  // Закрыть попап удаление строки по клику вне его
  $(document).mouseup(function (evt) {
    const formRemovePopup = $(".form-remove__popup");
    if (
      !formRemovePopup.is(evt.target) &&
      formRemovePopup.has(evt.target).length === 0
    ) {
      formRemovePopup.remove();
    }
  });

  // Добавить пункт контракта
  $(".js-add--contract").click(function (evt) {
    evt.preventDefault();

    let contractsCount = $("#contract_list").children().length;

    const contractLine = `
    <div class="form-line form-line--flex">
      <div class="form-item">
        <label for="contract_name_${contractsCount}" class="form-label">${contractsCount}</label>
        <input class="form-input" type="text" name="contract_name_${contractsCount}" id="contract_name_${contractsCount}">
      </div>

      <div class="form-item form-item--remove">
        <button type="button" class="form-remove form-remove--contract" title="Удалить"></button>
      </div>

    </div>
    `;

    $("#add_contact").before(contractLine);
  });

  // Показать/скрыть форму договора
  $("#contract_switch").on("change", function (evt) {
    evt.preventDefault();

    const billSection = $(this).parents(".bill-section");
    const billSectionText = billSection.find(".bill-section__text");
    const billSectionHidden = billSection.find(".bill-section__hidden");

    billSectionText.toggle();
    billSectionHidden.toggle();
  });

  // загрузка подписи
  $(document).on("change", ".form-file__input", function (evt) {
    const file = evt.target.files[0];

    if (file.type.startsWith("image/")) {
      const fileName = file.name;
      const formFileWrapper = $(this).parents(".form-file__wrapper");
      const formFileText = formFileWrapper.find(".form-file__text");

      formFileWrapper.addClass("form-file__wrapper--done");
      formFileText.text(fileName);
    }
  });

  $(document).on(
    "click",
    ".form-file__wrapper--done .form-file__btn",
    function (evt) {
      evt.preventDefault();

      const formFileWrapper = $(this).parents(".form-file__wrapper");
      const formFileText = formFileWrapper.find(".form-file__text");
      const formFileInput = formFileWrapper.find(".form-file__input");

      formFileWrapper.removeClass("form-file__wrapper--done");
      formFileText.text("Добавить подпись");
      formFileInput.val("");
    }
  );
});
