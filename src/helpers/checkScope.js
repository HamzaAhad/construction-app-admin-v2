import axios from "axios";

export const checkScope = async (loggedInUser, resolvedUrl) => {
  loggedInUser = loggedInUser ? JSON.parse(loggedInUser) : null;

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${loggedInUser?.user?.id}`,
    {
      headers: {
        Authorization: `Bearer ${loggedInUser?.accessToken}`,
      },
    }
  );
  console.log("user", loggedInUser, resolvedUrl);
  const scopes = response?.data?.userRoles?.scopes;
  console.log("scopes", scopes);
  const scopeExist = scopes?.find(
    (s) => resolvedUrl.includes(s?.page) && s?.permissions?.viewAll
  );
  if (!scopeExist) {
    return false;
  }
  return { scopes, canEdit: scopeExist?.permissions?.editAll };
};
