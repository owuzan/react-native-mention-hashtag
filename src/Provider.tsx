import { MentionHashtagTextProps } from "./MentionHashtagText";
import { createContext, useContext } from "react";

export const MentionHashtagContext = createContext<MentionHashtagTextProps>({});
export function useMentionHashtag() {
  const context = useContext(MentionHashtagContext);
  return context;
}

type ProviderProps = MentionHashtagTextProps & {
  children?: React.ReactNode;
};
export function Provider(props: ProviderProps) {
  const { children, ...rest } = props;
  return (
    <MentionHashtagContext.Provider value={rest}>
      {children}
    </MentionHashtagContext.Provider>
  );
}
Provider.displayName = "MentionHashtag.Provider";
