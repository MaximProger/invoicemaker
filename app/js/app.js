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

  // загрузка подписи/печати
  $(document).on("change", ".form-file__input", function (evt) {
    const formFileWrapper = $(this).parents(".form-file__wrapper");
    formFileWrapper.addClass("form-file__wrapper--changing");

    const file = evt.target.files[0];
    if (file.type.startsWith("image/")) {
      const fileObj = URL.createObjectURL(file);
      const fileName = file.name;

      if ($(this).hasClass("form-file__input--signature")) {
        $("#add_image").addClass("popup--signature");
        $("#add_image .popup__title").text("Добавление подписи");
        $("#add_image .popup__text").text(
          "Расположите подпись как можно ближе к границам рамки."
        );
        $("#add_image .popup__placeholder").html(
          `
          <div class="popup__wrapper popup__wrapper--signature">
            <img class="popup__img" src="${fileObj}" alt="${fileName}" loading="lazy">
          </div>
          `
        );
      } else {
        $("#add_image .popup__title").text("Добавление печати");
        $("#add_image .popup__text").text(
          "Расположите печать как можно ближе к границам рамки."
        );
        $("#add_image .popup__placeholder").html(
          `
          <div class="popup__wrapper popup__wrapper">
            <img class="popup__img" src="${fileObj}" alt="${fileName}" loading="lazy">
          </div>
          `
        );
      }

      $.fancybox.open({
        src: "#add_image",
      });
    }
  });

  $(document).on("click", ".popup--signature .popup__submit", function (evt) {
    evt.preventDefault();

    const popup = $(this).parents(".popup");
    const fileName = popup.find(".popup__img").prop("alt");
    const formFileWrapper = $(".form-file__wrapper--changing");
    const formFileText = formFileWrapper.find(".form-file__text");

    formFileWrapper.addClass("form-file__wrapper--done");
    formFileText.text(fileName);

    formFileWrapper.removeClass("form-file__wrapper--changing");

    $.fancybox.close({
      src: "#add_image",
    });
  });

  // сброс подписи/печати
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

  // input range
  for (let e of document.querySelectorAll(".form-range")) {
    e.style.setProperty("--value", e.value);
    e.style.setProperty("--min", e.min == "" ? "0" : e.min);
    e.style.setProperty("--max", e.max == "" ? "100" : e.max);
    e.addEventListener("input", () => e.style.setProperty("--value", e.value));
  }

  // Добавить сторону
  $(".js-add--side").click(function (evt) {
    evt.preventDefault();

    let sideCount = $("#side_list").children().length;

    const sideLine = `
    <div class="form-line form-line--flex">
    <div class="form-item w-336">
      <label for="job_${sideCount}" class="form-label">Должность</label>
      <input class="form-input" type="text" name="job_${sideCount}" id="job_${sideCount}">
    </div>
    <div class="form-item w-336">
      <label for="fio_${sideCount}" class="form-label">ФИО</label>
      <input class="form-input" type="text" name="fio_2" id="fio_${sideCount}">
    </div>
    <div class="form-item form-file w-266">
      <div class="form-file__wrapper">
        <label for="file_${sideCount}" class="form-file__btn"></label>
        <label for="file_${sideCount}" class="form-file__label">
          <input class="form-file__input form-file__input--signature" type="file" name="file_${sideCount}" id="file_${sideCount}">
          <span class="form-file__text">Добавить подпись</span>
        </label>
      </div>

    </div>
    <div class="form-item form-item--remove">
      <button type="button" class="form-remove form-remove--side" title="Удалить"></button>
    </div>
  </div>
    `;

    $("#add_side").before(sideLine);
  });

  // добавить предупреждение
  $("#alert_switch").on("change", function (evt) {
    evt.preventDefault();

    const billRowSection = $(this).parents(".bill-row__section");
    const billRowSectionHidden = billRowSection.find(".form__wrapper--hidden");

    billRowSectionHidden.toggle();
  });

  // выбор цвета
  $("#colorBtn").click(function (evt) {
    evt.preventDefault();

    $("#colorMenu").toggleClass("form-color__menu--active");
  });

  $(".form-color__label").click(function () {
    const newValue = $(this).prop("for");
    $("#colorBtn .form-color__value").css({ backgroundColor: "#" + newValue });

    $("#colorMenu").removeClass("form-color__menu--active");
  });

  // Закрыть попап выбора цвета по клику вне его
  $(document).mouseup(function (evt) {
    const colorMenu = $("#colorMenu");
    if (!colorMenu.is(evt.target) && colorMenu.has(evt.target).length === 0) {
      colorMenu.removeClass("form-color__menu--active");
    }
  });
});
