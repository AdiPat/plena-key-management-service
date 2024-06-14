interface RegisterUserRequestDTO {
  userId: string;
}

interface RegisterUserResponseDTO {
  userId: string;
  createdAt: Date;
}

export { RegisterUserRequestDTO, RegisterUserResponseDTO };
