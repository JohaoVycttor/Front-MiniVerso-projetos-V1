/**
 * Mensagens exibidas ao administrador.
 * Linguagem simples e sem termos técnicos (RNF27, RNF43). Nunca mostrar
 * códigos de erro ou mensagens vindas direto do servidor.
 */
export const MESSAGES = {
  loginInvalid: "E-mail ou senha incorretos.",
  loginMissing: "Preencha o e-mail e a senha.",
  loginLocked: (minutes: number) =>
    `Muitas tentativas sem sucesso. Por segurança, o acesso foi bloqueado por ${minutes} ${
      minutes === 1 ? "minuto" : "minutos"
    }.`,
  serverUnavailable: "Não foi possível conectar ao servidor. Tente de novo em instantes.",
  network: "Não foi possível conectar. Verifique sua internet e tente de novo.",
  sessionExpired: "Sua sessão expirou. Entre novamente para continuar.",
  forbidden: "Você não tem permissão para fazer isso.",
  notFound: "Não encontramos este item. Ele pode ter sido excluído.",
  validation: "Revise os campos destacados e tente de novo.",
  tooManyRequests: "Muitas tentativas seguidas. Aguarde um pouco e tente de novo.",
  generic: "Algo deu errado do nosso lado. Tente de novo em instantes.",
  unknown: "Não foi possível concluir a ação. Tente de novo.",
} as const;
