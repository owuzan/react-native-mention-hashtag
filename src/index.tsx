import { Fragment, createContext, useContext } from "react";
import { Text, TextProps } from "react-native";

export type MentionHashtagTextProps = TextProps & {
  onMentionPress?: (username: string) => void;
  onHashtagPress?: (hashtag: string) => void;
  minHashtagLength?: number;
  minMentionLength?: number;
  mentionTextStyle?: TextProps["style"];
  hashtagTextStyle?: TextProps["style"];
  children?: string | null;
  withSpace?: boolean;
};

function MentionHashtagText(props: MentionHashtagTextProps) {
  const context = useMentionHashtag();
  const {
    onMentionPress,
    onHashtagPress,
    minHashtagLength = 1,
    minMentionLength = 5,
    mentionTextStyle = {},
    hashtagTextStyle = {},
    children,
    withSpace = true,
    ...rest
  } = props;

  if (!children) {
    return null;
  }

  const parts = children.split(/[ \n]/g).map((part, partIndex) => {
    const partKey = `${partIndex}-${part}`;
    const space = withSpace ? " " : "";
    const mentionIndex = part.lastIndexOf("@");
    const hashtagIndex = part.lastIndexOf("#");
    const index = Math.max(mentionIndex, hashtagIndex);
    const type: "normal" | "mention" | "hashtag" =
      index === -1
        ? "normal"
        : mentionIndex > hashtagIndex
        ? "mention"
        : "hashtag";
    if (type === "normal") {
      return [
        part.length ? (
          <Fragment key={partKey}>
            {part}
            {space}
          </Fragment>
        ) : (
          <Fragment key={partKey}>{`\n${space}`}</Fragment>
        ),
      ];
    } else if (type === "mention") {
      return (
        <Fragment key={partKey}>
          {mentionIndex > 0 && (
            <MentionHashtagText withSpace={false} disabled={rest.disabled}>
              {part.slice(0, mentionIndex)}
            </MentionHashtagText>
          )}
          {part.slice(mentionIndex).length > minMentionLength ? (
            <Text
              key={index}
              onPress={() => {
                onMentionPress?.(part.slice(mentionIndex + 1));
              }}
              style={mentionTextStyle}
              disabled={rest.disabled}
            >
              {part.slice(mentionIndex)}
            </Text>
          ) : (
            part.slice(mentionIndex)
          )}
          {space}
        </Fragment>
      );
    } else if (type === "hashtag") {
      return (
        <Fragment key={partKey}>
          {hashtagIndex > 0 && (
            <MentionHashtagText withSpace={false} disabled={rest.disabled}>
              {part.slice(0, hashtagIndex)}
            </MentionHashtagText>
          )}
          {part.slice(hashtagIndex).length > minHashtagLength ? (
            <Text
              key={index}
              onPress={() => {
                onMentionPress?.(part.slice(hashtagIndex + 1));
              }}
              style={hashtagTextStyle}
              disabled={rest.disabled}
            >
              {part.slice(hashtagIndex)}
            </Text>
          ) : (
            part.slice(hashtagIndex)
          )}
          {space}
        </Fragment>
      );
    }
    return part;
  });

  return <Text {...rest}>{parts}</Text>;
}

const MentionHashtagContext = createContext<MentionHashtagTextProps>({});
function useMentionHashtag() {
  const context = useContext(MentionHashtagContext);
  return context;
}

function Provider(props: MentionHashtagTextProps) {
  const { children, ...rest } = props;
  return (
    <MentionHashtagContext.Provider value={rest}>
      {children}
    </MentionHashtagContext.Provider>
  );
}

MentionHashtagText.Provider = Provider;
