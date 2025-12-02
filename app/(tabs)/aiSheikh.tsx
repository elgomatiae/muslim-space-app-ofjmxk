
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, ActivityIndicator, Alert, Modal } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const SUPABASE_URL = 'https://teemloiwfnwrogwnoxsa.supabase.co';

export default function AiSheikhScreen() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (user && isSupabaseConfigured()) {
      loadConversations();
    } else {
      setIsLoadingConversations(false);
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user || !isSupabaseConfigured()) return;

    try {
      const { data, error } = await supabase
        .from('ai_sheikh_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading conversations:', error);
      } else if (data) {
        setConversations(data);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const loadConversationMessages = async (conversationId: string) => {
    if (!user || !isSupabaseConfigured()) return;

    setIsLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('ai_sheikh_chats')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
      } else if (data) {
        const formattedMessages: Message[] = data.map((msg) => ({
          id: msg.id,
          role: msg.message_role as 'user' | 'assistant',
          content: msg.message_content,
          created_at: msg.created_at,
        }));
        setMessages(formattedMessages);
        setCurrentConversationId(conversationId);
        setSidebarVisible(false);
        
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const startNewConversation = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setSidebarVisible(false);
  };

  const sendMessage = async () => {
    console.log('=== SEND MESSAGE CALLED ===');
    console.log('Input text:', inputText);
    console.log('Input text length:', inputText.length);
    console.log('Input text trimmed:', inputText.trim());
    console.log('Input text trimmed length:', inputText.trim().length);
    
    if (!inputText.trim()) {
      console.log('Input text is empty after trim, returning');
      Alert.alert('Empty Message', 'Please enter a question before sending.');
      return;
    }

    if (!user || !isSupabaseConfigured()) {
      console.log('User not authenticated or Supabase not configured');
      Alert.alert('Sign In Required', 'Please sign in to ask questions to the AI Sheikh.');
      return;
    }

    console.log('Creating user message...');
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      created_at: new Date().toISOString(),
    };

    console.log('Adding user message to state');
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      console.log('Getting session...');
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Failed to get session: ' + sessionError.message);
      }

      const token = sessionData?.session?.access_token;

      if (!token) {
        console.error('No token found in session');
        throw new Error('No authentication token found. Please sign in again.');
      }

      console.log('Token obtained, length:', token.length);
      console.log('Calling Edge Function at:', `${SUPABASE_URL}/functions/v1/ai-sheikh`);
      
      const requestBody = {
        question: userMessage.content,
        conversationId: currentConversationId,
      };
      
      console.log('Request body:', JSON.stringify(requestBody));

      const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-sheikh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response received');
      console.log('Response status:', response.status);
      console.log('Response statusText:', response.statusText);
      console.log('Response headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));

      if (!response.ok) {
        let errorMessage = 'Failed to get response';
        try {
          const errorData = await response.json();
          console.error('Error response data:', errorData);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          console.error('Error response text:', errorText);
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log('Response data received:', responseData);

      const { answer, conversationId } = responseData;
      console.log('Received answer:', answer);
      console.log('Conversation ID:', conversationId);

      if (!answer) {
        throw new Error('Empty response from AI');
      }

      if (!currentConversationId && conversationId) {
        setCurrentConversationId(conversationId);
        loadConversations();
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error: any) {
      console.error('=== ERROR IN SEND MESSAGE ===');
      console.error('Error type:', typeof error);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      console.error('Full error:', JSON.stringify(error, null, 2));
      
      Alert.alert(
        'Error', 
        `Failed to get response from AI Sheikh: ${error?.message || 'Unknown error'}. Please try again.`
      );
      
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!user || !isSupabaseConfigured()) return;

            try {
              const { error } = await supabase
                .from('ai_sheikh_conversations')
                .delete()
                .eq('id', conversationId);

              if (error) {
                console.error('Error deleting conversation:', error);
                Alert.alert('Error', 'Failed to delete conversation.');
              } else {
                if (currentConversationId === conversationId) {
                  startNewConversation();
                }
                loadConversations();
              }
            } catch (error) {
              console.error('Error deleting conversation:', error);
              Alert.alert('Error', 'Failed to delete conversation.');
            }
          },
        },
      ]
    );
  };

  const suggestedQuestions = [
    'What are the five pillars of Islam?',
    'How do I perform wudu correctly?',
    'What is the importance of Salah?',
    'Can you explain the concept of Tawhid?',
    'What are the benefits of reading Quran?',
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            console.log('Menu button pressed');
            setSidebarVisible(true);
          }} 
          style={styles.menuButton}
          activeOpacity={0.7}
        >
          <IconSymbol
            ios_icon_name="line.3.horizontal"
            android_material_icon_name="menu"
            size={24}
            color={colors.card}
          />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <IconSymbol
              ios_icon_name="book.fill"
              android_material_icon_name="menu-book"
              size={28}
              color={colors.card}
            />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>AI Sheikh</Text>
            <Text style={styles.headerSubtitle}>
              {currentConversationId ? 'Conversation' : 'New Chat'}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={() => {
            console.log('New chat button pressed');
            startNewConversation();
          }} 
          style={styles.newChatButton}
          activeOpacity={0.7}
        >
          <IconSymbol
            ios_icon_name="square.and.pencil"
            android_material_icon_name="edit"
            size={20}
            color={colors.card}
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
        >
          {isLoadingMessages ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading conversation...</Text>
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <IconSymbol
                  ios_icon_name="bubble.left.and.bubble.right"
                  android_material_icon_name="chat"
                  size={64}
                  color={colors.textSecondary}
                />
              </View>
              <Text style={styles.emptyTitle}>As-salamu alaykum!</Text>
              <Text style={styles.emptyText}>
                Welcome to AI Sheikh. Ask any Islamic question and receive guidance based on the Quran and Sunnah.
              </Text>
              
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Suggested Questions:</Text>
                {suggestedQuestions.map((question, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionButton}
                    onPress={() => {
                      console.log('Suggestion clicked:', question);
                      setInputText(question);
                    }}
                    activeOpacity={0.7}
                  >
                    <IconSymbol
                      ios_icon_name="lightbulb"
                      android_material_icon_name="lightbulb"
                      size={16}
                      color={colors.primary}
                    />
                    <Text style={styles.suggestionText}>{question}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.disclaimerCard}>
                <IconSymbol
                  ios_icon_name="info.circle"
                  android_material_icon_name="info"
                  size={20}
                  color={colors.warning}
                />
                <Text style={styles.disclaimerText}>
                  This AI provides general Islamic guidance. For specific religious rulings, please consult a qualified scholar.
                </Text>
              </View>
            </View>
          ) : (
            <React.Fragment>
              {messages.map((message, index) => (
                <View
                  key={`message-${index}`}
                  style={[
                    styles.messageCard,
                    message.role === 'user' ? styles.userMessage : styles.assistantMessage,
                  ]}
                >
                  <View style={styles.messageHeader}>
                    <View style={[
                      styles.messageAvatar,
                      message.role === 'user' ? styles.userAvatar : styles.assistantAvatar,
                    ]}>
                      <IconSymbol
                        ios_icon_name={message.role === 'user' ? 'person.fill' : 'book.fill'}
                        android_material_icon_name={message.role === 'user' ? 'person' : 'menu-book'}
                        size={16}
                        color={colors.card}
                      />
                    </View>
                    <Text style={styles.messageRole}>
                      {message.role === 'user' ? 'You' : 'AI Sheikh'}
                    </Text>
                  </View>
                  <Text style={styles.messageContent}>{message.content}</Text>
                </View>
              ))}
              {isLoading && (
                <View style={[styles.messageCard, styles.assistantMessage]}>
                  <View style={styles.messageHeader}>
                    <View style={[styles.messageAvatar, styles.assistantAvatar]}>
                      <IconSymbol
                        ios_icon_name="book.fill"
                        android_material_icon_name="menu-book"
                        size={16}
                        color={colors.card}
                      />
                    </View>
                    <Text style={styles.messageRole}>AI Sheikh</Text>
                  </View>
                  <View style={styles.typingIndicator}>
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                  </View>
                </View>
              )}
            </React.Fragment>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ask a question about Islam..."
              placeholderTextColor={colors.textSecondary}
              value={inputText}
              onChangeText={(text) => {
                console.log('Text input changed:', text);
                setInputText(text);
              }}
              multiline
              maxLength={500}
              editable={!isLoading}
              returnKeyType="default"
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[
                styles.sendButton, 
                (!inputText.trim() || isLoading) && styles.sendButtonDisabled
              ]}
              onPress={() => {
                console.log('=== SEND BUTTON PRESSED ===');
                sendMessage();
              }}
              disabled={!inputText.trim() || isLoading}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.card} />
              ) : (
                <IconSymbol
                  ios_icon_name="paperplane.fill"
                  android_material_icon_name="send"
                  size={20}
                  color={colors.card}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={sidebarVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSidebarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setSidebarVisible(false)}
          />
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Chat History</Text>
              <TouchableOpacity onPress={() => setSidebarVisible(false)}>
                <IconSymbol
                  ios_icon_name="xmark"
                  android_material_icon_name="close"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.newConversationButton}
              onPress={startNewConversation}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="plus.circle.fill"
                android_material_icon_name="add-circle"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.newConversationText}>New Conversation</Text>
            </TouchableOpacity>

            <ScrollView style={styles.conversationsList}>
              {isLoadingConversations ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              ) : conversations.length === 0 ? (
                <View style={styles.emptyConversations}>
                  <IconSymbol
                    ios_icon_name="bubble.left.and.bubble.right"
                    android_material_icon_name="chat"
                    size={48}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.emptyConversationsText}>
                    No conversations yet. Start a new chat!
                  </Text>
                </View>
              ) : (
                <React.Fragment>
                  {conversations.map((conversation, index) => (
                    <View key={`conversation-${index}`} style={styles.conversationItemWrapper}>
                      <TouchableOpacity
                        style={[
                          styles.conversationItem,
                          currentConversationId === conversation.id && styles.conversationItemActive,
                        ]}
                        onPress={() => loadConversationMessages(conversation.id)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.conversationIcon}>
                          <IconSymbol
                            ios_icon_name="message.fill"
                            android_material_icon_name="chat"
                            size={20}
                            color={currentConversationId === conversation.id ? colors.primary : colors.textSecondary}
                          />
                        </View>
                        <View style={styles.conversationInfo}>
                          <Text 
                            style={[
                              styles.conversationTitle,
                              currentConversationId === conversation.id && styles.conversationTitleActive,
                            ]}
                            numberOfLines={2}
                          >
                            {conversation.title}
                          </Text>
                          <Text style={styles.conversationDate}>
                            {formatDate(conversation.updated_at)}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => deleteConversation(conversation.id)}
                          activeOpacity={0.7}
                        >
                          <IconSymbol
                            ios_icon_name="trash"
                            android_material_icon_name="delete"
                            size={18}
                            color={colors.error}
                          />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    </View>
                  ))}
                </React.Fragment>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    marginRight: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.card,
    opacity: 0.9,
  },
  newChatButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  suggestionsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  suggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    gap: 10,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  messageCard: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 12,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  messageAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  assistantAvatar: {
    backgroundColor: colors.secondary,
  },
  messageRole: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  messageContent: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  typingIndicator: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textSecondary,
    opacity: 0.6,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 100 : 90,
    zIndex: 100,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: '80%',
    maxWidth: 320,
    backgroundColor: colors.card,
    paddingTop: Platform.OS === 'android' ? 48 : 60,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  newConversationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  newConversationText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  conversationsList: {
    flex: 1,
  },
  emptyConversations: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyConversationsText: {
    marginTop: 16,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  conversationItemWrapper: {
    paddingHorizontal: 12,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: colors.background,
    gap: 12,
  },
  conversationItemActive: {
    backgroundColor: colors.primary,
    opacity: 0.1,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  conversationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  conversationTitleActive: {
    color: colors.primary,
  },
  conversationDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 8,
  },
});
