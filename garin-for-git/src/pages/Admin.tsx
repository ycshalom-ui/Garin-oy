import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Admin() {
  const [user, setUser] = useState<any>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'posts' | 'events' | 'gallery'>('posts')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [galleryFile, setGalleryFile] = useState<File | null>(null)
  const [galleryPreview, setGalleryPreview] = useState<string>('')

  // Post form with image
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'עדכונים',
    author: 'צוות הגרעין',
    image_url: '',
    tags: ''
  })

  // Event form
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: ''
  })

  // Gallery form
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    album: '',
    type: 'image' as 'image' | 'video'
  })

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data } = await supabase.auth.getSession()
    setUser(data.session?.user ?? null)
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Convert username to email format for Supabase Auth
    const email = username.includes('@') ? username : `${username}@garinoy.local`

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMessage('שגיאה בהתחברות: ' + error.message)
    } else {
      setMessage('✅ התחברת בהצלחה!')
      checkUser()
    }
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function uploadImage(): Promise<string> {
    if (!imageFile) return ''
    
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `post-images/${fileName}`

    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, imageFile)

    if (error) {
      console.error('Error uploading image:', error)
      return ''
    }

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  async function handlePostSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    let imageUrl = postForm.image_url
    if (imageFile) {
      imageUrl = await uploadImage()
    }

    const tags = postForm.tags.split(',').map(t => t.trim()).filter(Boolean)

    const { error } = await supabase.from('posts').insert([{
      ...postForm,
      image_url: imageUrl,
      tags,
      published: true
    }])

    if (error) {
      setMessage('שגיאה ביצירת פוסט: ' + error.message)
    } else {
      setMessage('✅ הפוסט נוצר בהצלחה!')
      setPostForm({ title: '', content: '', excerpt: '', category: 'עדכון', author: 'צוות הגרעין', image_url: '', tags: '' })
      setImageFile(null)
      setImagePreview('')
    }
    setLoading(false)
  }

  async function handleEventSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.from('events').insert([eventForm])

    if (error) {
      setMessage('שגיאה ביצירת אירוע: ' + error.message)
    } else {
      setMessage('✅ האירוע נוצר בהצלחה!')
      setEventForm({ title: '', description: '', date: '', time: '', location: '' })
    }
    setLoading(false)
  }

  function handleGalleryFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setGalleryFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setGalleryPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function uploadGalleryFile(): Promise<string> {
    if (!galleryFile) return ''
    
    const fileExt = galleryFile.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const bucket = galleryForm.type === 'image' ? 'images' : 'videos'
    const filePath = `gallery/${fileName}`

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, galleryFile)

    if (error) {
      console.error('Error uploading file:', error)
      return ''
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  async function handleGallerySubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (!galleryFile) {
      setMessage('שגיאה: נא לבחור קובץ')
      setLoading(false)
      return
    }

    const url = await uploadGalleryFile()
    if (!url) {
      setMessage('שגיאה בהעלאת הקובץ')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('gallery_items').insert([{
      title: galleryForm.title || null,
      album: galleryForm.album,
      type: galleryForm.type,
      url: url
    }])

    if (error) {
      setMessage('שגיאה בהוספה לגלריה: ' + error.message)
    } else {
      setMessage('✅ הפריט נוסף לגלריה בהצלחה!')
      setGalleryForm({ title: '', album: '', type: 'image' })
      setGalleryFile(null)
      setGalleryPreview('')
    }
    setLoading(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            כניסת מנהלים
          </h1>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="text"
              placeholder="שם משתמש"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              autoComplete="username"
            />
            <input
              type="password"
              placeholder="סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              autoComplete="current-password"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-800 transition disabled:opacity-50"
            >
              {loading ? 'מתחבר...' : 'התחבר'}
            </button>

            {message && (
              <p className={`text-center font-bold ${message.includes('שגיאה') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}
          </form>

          <div className="mt-8 p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
            <p className="font-bold mb-2">💡 הוראות:</p>
            <p>• הזן שם משתמש וסיסמה</p>
            <p>• רק מנהלים יכולים להיכנס</p>
            <p>• ליצירת משתמשים חדשים - פנה למנהל הראשי</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-professional">🎛️ ניהול האתר</h1>
            <p className="text-gray-600">שלום, {user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition"
          >
            יציאה
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 px-6 py-4 font-bold text-lg transition ${
                activeTab === 'posts' ? 'bg-blue-professional text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📝 ניהול פוסטים
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex-1 px-6 py-4 font-bold text-lg transition ${
                activeTab === 'events' ? 'bg-blue-professional text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📅 ניהול אירועים
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 px-6 py-4 font-bold text-lg transition ${
                activeTab === 'gallery' ? 'bg-blue-professional text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🖼️ ניהול גלריה
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'posts' && (
              <form onSubmit={handlePostSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-blue-professional mb-4">הוסף פוסט חדש</h2>
                
                <input
                  type="text"
                  placeholder="כותרת הפוסט"
                  value={postForm.title}
                  onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-professional focus:outline-none"
                />

                <select
                  value={postForm.category}
                  onChange={(e) => setPostForm({...postForm, category: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-professional focus:outline-none"
                >
                  <option value="פרשת השבוע">📖 פרשת השבוע</option>
                  <option value="עדכונים">📰 עדכונים</option>
                </select>

                <input
                  type="text"
                  placeholder="תגיות (מופרדות בפסיק, למשל: שבת, תפילה, חינוך)"
                  value={postForm.tags}
                  onChange={(e) => setPostForm({...postForm, tags: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-professional focus:outline-none"
                />

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                  <label className="block mb-2 font-bold text-gray-700">📸 תמונה לפוסט (מ-Canva או אחר)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="w-full"
                  />
                  {imagePreview && (
                    <div className="mt-4">
                      <img src={imagePreview} alt="תצוגה מקדימה" className="max-w-md rounded-xl shadow-lg" />
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="תקציר (אופציונלי)"
                  value={postForm.excerpt}
                  onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-professional focus:outline-none"
                />

                <textarea
                  placeholder="תוכן הפוסט"
                  value={postForm.content}
                  onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                  required
                  rows={10}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-professional focus:outline-none resize-none"
                ></textarea>

                <input
                  type="text"
                  placeholder="שם המחבר"
                  value={postForm.author}
                  onChange={(e) => setPostForm({...postForm, author: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-professional focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition disabled:opacity-50"
                >
                  {loading ? 'שומר...' : '✅ פרסם פוסט'}
                </button>

                {message && (
                  <p className={`text-center font-bold text-lg ${message.includes('שגיאה') ? 'text-red-600' : 'text-green-600'}`}>
                    {message}
                  </p>
                )}
              </form>
            )}

            {activeTab === 'events' && (
              <form onSubmit={handleEventSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-blue-professional mb-4">הוסף אירוע חדש</h2>
                
                <input
                  type="text"
                  placeholder="שם האירוע"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-professional focus:outline-none"
                />

                <textarea
                  placeholder="תיאור האירוע"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-professional focus:outline-none resize-none"
                ></textarea>

                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-professional focus:outline-none"
                />

                <input
                  type="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-professional focus:outline-none"
                />

                <input
                  type="text"
                  placeholder="מיקום האירוע"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-professional focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition disabled:opacity-50"
                >
                  {loading ? 'שומר...' : '✅ פרסם אירוע'}
                </button>

                {message && (
                  <p className={`text-center font-bold text-lg ${message.includes('שגיאה') ? 'text-red-600' : 'text-green-600'}`}>
                    {message}
                  </p>
                )}
              </form>
            )}

            {activeTab === 'gallery' && (
              <form onSubmit={handleGallerySubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-blue-professional mb-4">הוסף תמונה או סרטון לגלריה</h2>
                
                <input
                  type="text"
                  placeholder="כותרת (אופציונלי)"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-professional focus:outline-none"
                />

                <input
                  type="text"
                  placeholder='שם האלבום (למשל: "מסיבת פורים 2026")'
                  value={galleryForm.album}
                  onChange={(e) => setGalleryForm({...galleryForm, album: e.target.value})}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-professional focus:outline-none"
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    סוג המדיה
                  </label>
                  <select
                    value={galleryForm.type}
                    onChange={(e) => setGalleryForm({...galleryForm, type: e.target.value as 'image' | 'video'})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-professional focus:outline-none"
                  >
                    <option value="image">📸 תמונה</option>
                    <option value="video">🎥 סרטון</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {galleryForm.type === 'image' ? 'בחר תמונה' : 'בחר סרטון'}
                  </label>
                  <input
                    type="file"
                    accept={galleryForm.type === 'image' ? 'image/*' : 'video/*'}
                    onChange={handleGalleryFileSelect}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-professional focus:outline-none"
                  />
                  {galleryPreview && (
                    <div className="mt-4 relative rounded-xl overflow-hidden">
                      {galleryForm.type === 'image' ? (
                        <img src={galleryPreview} alt="תצוגה מקדימה" className="w-full max-h-96 object-contain bg-gray-100" />
                      ) : (
                        <video src={galleryPreview} controls className="w-full max-h-96" />
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !galleryFile}
                  className="w-full bg-purple-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-800 transition disabled:opacity-50"
                >
                  {loading ? 'מעלה...' : '📤 העלה לגלריה'}
                </button>

                {message && (
                  <p className={`text-center font-bold text-lg ${message.includes('שגיאה') ? 'text-red-600' : 'text-green-600'}`}>
                    {message}
                  </p>
                )}

                <div className="bg-blue-50 p-4 rounded-xl text-sm">
                  <p className="font-bold mb-2">💡 טיפים:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• שם האלבום יקבץ תמונות וסרטונים יחד</li>
                    <li>• אפשר להעלות תמונות עד 5MB</li>
                    <li>• סרטונים עד 100MB</li>
                    <li>• פורמטים נתמכים: JPG, PNG, MP4, MOV</li>
                  </ul>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
