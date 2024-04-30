# React Native Mention Hashtag

This package allows you to capture mention (tagging) and hashtag elements within text in React Native applications. When a mention or hashtag is detected within the text, it calls the specified callback functions, providing customized functionality to the user.

## How to Use

### Installation

You can install the package in your project using npm or yarn:

```bash
npm install react-native-mention-hashtag
```

or

```bash
yarn add react-native-mention-hashtag
```

### Usage

This package provides two components named MentionHashtagText and MentionHashtagTextProvider. Under MentionHashtagText, there is a provider named `Provider`. MentionHashtagTextProvider is equivalent to MentionHashtagText.Provider. The provider component provides necessary properties such as onMentionPress and onHashtagPress, and these properties are passed to all MentionHashtagText components. However, the provider component is optional, and the MentionHashtagText component can be used directly without any component.

```tsx
import React from "react";
import { View } from "react-native";
import { MentionHashtagText } from "react-native-mention-hashtag";

const MyComponent = () => {
  const handleMentionPress = (mention: string) => {
    console.log("Mention pressed:", mention);
  };

  const handleHashtagPress = (hashtag: string) => {
    console.log("Hashtag pressed:", hashtag);
  };

  return (
    <Provider
      onMentionPress={handleMentionPress}
      onHashtagPress={handleHashtagPress}
    >
      <View>
        <MentionHashtagText>Hello @world #reactnative</MentionHashtagText>
      </View>
    </Provider>
  );
};

export default MyComponent;
```

### Props

---

| Prop               | Description                                        | Default     | Example Usage                               |
| ------------------ | -------------------------------------------------- | ----------- | ------------------------------------------- |
| `onMentionPress`   | Callback function called when a mention is pressed | `undefined` | `(mention: string) => console.log(mention)` |
| `onHashtagPress`   | Callback function called when a hashtag is pressed | `undefined` | `(hashtag: string) => console.log(hashtag)` |
| `minHashtagLength` | Minimum length of a hashtag                        | 1           | `3`                                         |
| `minMentionLength` | Minimum length of a mention                        | 5           | `3`                                         |
| `mentionTextStyle` | Style object for mention text                      | `{}`        | `{ color: 'blue' }`                         |
| `hashtagTextStyle` | Style object for hashtag text                      | `{}`        | `{ color: 'green' }`                        |

The MentionHashtagText component inherits all props of the Text component in React Native, such as `style`, `numberOfLines`, `onLayout`, etc.

### Examples

#### Basic Usage

```tsx
<MentionHashtagText
  onMentionPress={(mention) => console.log("Mention pressed:", mention)}
  onHashtagPress={(hashtag) => console.log("Hashtag pressed:", hashtag)}
>
  Hello @world #reactnative
</MentionHashtagText>
```

#### Applying Styles

```tsx
<MentionHashtagText
  onMentionPress={(mention) => console.log("Mention pressed:", mention)}
  onHashtagPress={(hashtag) => console.log("Hashtag pressed:", hashtag)}
  mentionTextStyle={{ fontWeight: "bold", color: "blue" }}
  hashtagTextStyle={{ fontStyle: "italic", color: "green" }}
>
  Hello @world #reactnative
</MentionHashtagText>
```

#### Setting Minimum Lengths

```tsx
<MentionHashtagText
  onMentionPress={(mention) => console.log("Mention pressed:", mention)}
  onHashtagPress={(hashtag) => console.log("Hashtag pressed:", hashtag)}
  minMentionLength={3}
  minHashtagLength={2}
>
  Hello @world #reactnative
</MentionHashtagText>
```

These examples demonstrate different usage scenarios and features of the package. Feel free to apply these examples to your own project to better understand the package.
