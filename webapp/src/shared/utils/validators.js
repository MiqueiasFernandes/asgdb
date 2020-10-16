const NAME_REGEX =
    "a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð,.'-";
const NAME_VAL = new RegExp("^[" + NAME_REGEX + "]{2,}$");
const SNAME_VAL = new RegExp(
    "^[" + NAME_REGEX + "]{2,}(\\s[" + NAME_REGEX + "]{2,})*$"
);

const EMAIL_REGEX = new RegExp(/^[a-zA-Z0-9_]{2,}@[a-zA-Z0-9_]+\.[a-zA-Z0-9_.]{2,}$/)
const PASSWORD_REGEXS = [/\d+/, /[a-zA-Z]+/, /^.{4,12}$/].map(r => new RegExp(r))

export const valid_first_name = (str) => str && NAME_VAL.test(str)
export const valid_last_name = (str) => str && SNAME_VAL.test(str)
export const valid_full_name = (str) => str && valid_first_name(str.split(' ')[0]) && str.includes(' ') && valid_last_name(str.split(' ').slice(1))
export const valid_name = (str) => str && valid_first_name(str.split(' ')[0]) && (!str.includes(' ') || valid_last_name(str.split(' ').slice(1)))
export const valid_email = (str) => str && EMAIL_REGEX.test(str)
export const valid_password = (str) => str && PASSWORD_REGEXS.every(v => v.test(str))

export const invalid_first_name = (str) => !valid_first_name(str)
export const invalid_last_name = (str) => !valid_last_name(str)
export const invalid_full_name = (str) => !valid_full_name(str)
export const invalid_name = (str) => !valid_name(str)
export const invalid_email = (str) => !valid_email(str)
export const invalid_password = (str) => !valid_password(str)
