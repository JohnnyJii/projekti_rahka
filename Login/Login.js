$('.form').find('input').on('keyup blur focus', function (e) {

  var $this = $(this),
      label = $this.prev('label');

  if (e.type === 'keyup') {
    if ($this.val() === '') {
      label.removeClass('active highlight');
    } else {
      label.addClass('active highlight');
    }
  } else if (e.type === 'blur') {
    if( $this.val() === '' ) {
      label.removeClass('active highlight');
    } else {
      label.removeClass('highlight');
    }
  } else if (e.type === 'focus') {

    if( $this.val() === '' ) {
      label.removeClass('highlight');
    }
    else if( $this.val() !== '' ) {
      label.addClass('highlight');
    }
  }

});

$('.tab a').on('click', function (e) {

  e.preventDefault();

  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');

  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();

  $(target).fadeIn(600);

});

function validateForm(formId)
{
  var inputs, index;
  var form=document.getElementById(formId);
  inputs = form.getElementsByTagName('input');
  for (index = 0; index < inputs.length; ++index) {
    // deal with inputs[index] element.
    if (inputs[index].value==null || inputs[index].value=="")
    {
      alert("Field is empty");
      return false;
    }
  }
}