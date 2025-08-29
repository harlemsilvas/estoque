// src/utils/dateUtils.js

/**
 * Formata uma data para o padrão brasileiro DD/MM/YYYY
 * @param {Date|string} date - Data para formatação
 * @returns {string} Data formatada no padrão DD/MM/YYYY
 */
export const formatDateBR = (date) => {
  if (!date) return "";

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return "";

  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Formata uma data para o padrão brasileiro DD/MM/YYYY HH:mm
 * @param {Date|string} date - Data para formatação
 * @returns {string} Data formatada no padrão DD/MM/YYYY HH:mm
 */
export const formatDateTimeBR = (date) => {
  if (!date) return "";

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return "";

  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Retorna a data atual no formato DD/MM/YYYY
 * @returns {string} Data atual formatada
 */
export const getCurrentDateBR = () => {
  return formatDateBR(new Date());
};

/**
 * Retorna a data atual no formato ISO para formulários (YYYY-MM-DD)
 * @returns {string} Data atual no formato ISO
 */
export const getCurrentDateISO = () => {
  return new Date().toISOString().split("T")[0];
};

/**
 * Converte data do formato DD/MM/YYYY para YYYY-MM-DD (para inputs date)
 * @param {string} dateBR - Data no formato DD/MM/YYYY
 * @returns {string} Data no formato YYYY-MM-DD
 */
export const convertBRtoISO = (dateBR) => {
  if (!dateBR || !dateBR.includes("/")) return "";

  const [day, month, year] = dateBR.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

/**
 * Converte data do formato YYYY-MM-DD para DD/MM/YYYY
 * @param {string} dateISO - Data no formato YYYY-MM-DD
 * @returns {string} Data no formato DD/MM/YYYY
 */
export const convertISOtoBR = (dateISO) => {
  if (!dateISO || !dateISO.includes("-")) return "";

  const [year, month, day] = dateISO.split("-");
  return `${day}/${month}/${year}`;
};
