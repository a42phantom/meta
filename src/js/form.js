/*$('form[data-form="search"] .searchButton').on('click', function(e) {
	e.preventDefault();
	
});*/

function clearForm(param) {
	$(param).find('textarea').val('');
	q = $(param).find('input');
	q = $.makeArray(q);
	q.forEach(function(item) {
		if($(item).attr('type') != 'hidden' && $(item).attr('type') != 'submit'){
			$(item).val('');
		}
	})
}

$('form:not(form[data-form="search"])').submit(function(e) {
	e.preventDefault();
	var error = false;
	var url = '/assets/mailers/mailCore.php';
	var msg = $(this).serialize();
	
	var form = $(this);
	var formType = form.attr('data-form');
	var formSubject = '';
	var fd = new FormData(this);
	console.log(formSubject);
	switch (formType) {
		case 'questionForm':
			formSubject = 'Заявка Задать вопрос';
		break;
		case 'connectForm':
			formSubject = 'Заявка Присоедениться';
		break;
		case 'priceForm':
			formSubject = 'Заказ тарифа';
		break;
		case 'mainPageFollowForm':
			formSubject = 'Заявка Сопроваждение под ключ';
		break;
		case 'callBackForm':
			formSubject = 'Заявка Обратная связь';
		break;
		case 'newsListForm':
			formSubject = 'Заявка на бесплатную консультацию';
		break;
		default:
			formSubject = 'Заявка с сайта '+location.hostname;
		break;
	}
	fd.append('formSubject', formSubject);
	/*if ($(form).find('input[type="file"]').val() != '') {
		console.log($(form).find('input[type="file"]'));
		msg += '&userfile='+$(form).find('input[type="file"]').val();
	}*/
	fd.append('antiSpam','');
	var msgArr = form.find('input');
	var msgArrPush = form.find('select');
	msgArr.push(msgArrPush);
	var msgArr = $.makeArray(msgArr);
	var checkSpam = false;
	console.log(msg);
	//console.log(form);
	//console.log(msgArr);
	msgArr.forEach(function(item) {
		var thisItem = $(item).attr('type');

		console.log('----------------------');
		console.log(thisItem);
		switch (thisItem) {
			/*case 'file' : {
				console.log($(item).attr('name'));
				var files = $(item).prop('files')[0];
				console.log(files);
				fd.append('userfile', files.name);
				break;
			}*/
			case 'data': {
				if ($(item).val() == '') {
					error = true;
				}
				console.log($(item).val());
				break;
			}
			case 'doctors': {
				if ($(item).val() == '') {
					error = true;
				}
				console.log($(item).val());
				break;
			}
			case 'name': {
				if ($(item).val() == '') {
					error = true;
				}
				console.log($(item).val());
				break;
			}
			case 'tel': {
				if($(item).val() !== '') {
					pattern = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
					result = pattern.test($(item).val());
					if (!result) {
						error = true;
					}
				} else {
					error = true;
					/*clearForm(form);*/
				}
				console.log($(item).val());
				break;
			}
			case 'email': {
				if($(item).val() !== '') {
					pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,3}$/i;
					result = pattern.test($(item).val());
					if (!result) {
						error = true;
					}
				} else {
					error = true;
					/*clearForm(form);*/
				}
				console.log($(item).val());
				break;
			}
			case 'file': {
				//prop('files')[0]
				var userfile = this.querySelector('input[type="file"]').files[0];
				console.log(userfile);
				fd.append('userfile', $('input[type=file]')[0].files[0]); 
				console.log(fd);
			}
			default: {
				
			}
		}
		if ($(form).find('textarea').length > 0) {
			if ($(form).find('textarea').val() === '') {
				error = true;
			}
		}
	});

	if (!error) {
		if ($(form).find('input[name="policy"]').prop('checked')) {
			$.ajax({
				type: "POST",
				url: url,
				/*dataType: 'json',*/
				data: fd,
		        processData: false,
		        contentType: false,
				success: function(msg){
					if(msg === "OK"){
						result = "Заявка успешно отправлена!";
						console.log('ok');
						$('.modal').modal('hide');
						clearForm(form);
						swal(
							'Сообщение отправлено успешно!',
							'',
							'success'
						);
					}
					else{
						if (msg == 'SPAM') {
							swal(
								'Здесь нет места спаму!!!',
								'',
								'warning'
							);
							$('.antiSpam').val('')
						} else {
							swal(
								'Произошла ошибка, попробуйте еще раз!',
								'',
								'error'
							);
						}
					}
					/*console.log(form);*/
				}
			});
		} else {
			console.log(formType);
			swal(
				'Вы не дали разрешения на обработку персональных данных!',
				'',
				'warning'
			);	
		}
	} else {
		swal(
			'Заполните все поля',
			'',
			'warning'
		);
	}
});