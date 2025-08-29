export const registrarAlteracao = (
  entidade,
  id,
  alteracoes,
  usuario = "Sistema"
) => {
  const historico = {
    data: new Date().toISOString(),
    usuario,
    alteracoes,
  };

  return api.patch(`/${entidade}/${id}`, {
    historico: { $push: [historico] },
  });
};
